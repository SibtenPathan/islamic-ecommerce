'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './HeroCarousel.css';

interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    buttonText?: string;
}

// Fallback banner when no banners in database
const fallbackBanner: Banner = {
    _id: 'fallback',
    title: 'Discount 30%',
    subtitle: 'Women Dress Maroon',
    image: '/images/Home1/fococlipping-20211228-164156 1-22.png',
    link: '/products',
    buttonText: 'Shop Now',
};

export default function HeroCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/admin/banners');
                const data = await response.json();
                if (data.banners && data.banners.length > 0) {
                    setBanners(data.banners);
                } else {
                    setBanners([fallbackBanner]);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
                setBanners([fallbackBanner]);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    // Auto-advance slides
    useEffect(() => {
        if (banners.length <= 1) return;

        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [banners.length, nextSlide]);

    if (loading) {
        return (
            <section className="hero hero-loading">
                <div className="hero-container">
                    <div className="loading-placeholder"></div>
                </div>
            </section>
        );
    }

    const currentBanner = banners[currentIndex];

    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <span className="hero-badge">Limited Time Offer</span>
                    <h1 className="hero-title">{currentBanner.title}</h1>
                    {currentBanner.subtitle && (
                        <p className="hero-subtitle">{currentBanner.subtitle}</p>
                    )}
                    {currentBanner.link && (
                        <Link href={currentBanner.link} className="hero-btn">
                            {currentBanner.buttonText || 'Shop Now'}
                        </Link>
                    )}
                </div>
                <div className="hero-image">
                    <Image
                        src={currentBanner.image}
                        alt={currentBanner.title}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                        priority
                    />
                </div>

                {/* Navigation */}
                {banners.length > 1 && (
                    <>
                        <button
                            className="carousel-nav prev"
                            onClick={prevSlide}
                            aria-label="Previous slide"
                        >
                            ‹
                        </button>
                        <button
                            className="carousel-nav next"
                            onClick={nextSlide}
                            aria-label="Next slide"
                        >
                            ›
                        </button>

                        {/* Dots */}
                        <div className="carousel-dots">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
