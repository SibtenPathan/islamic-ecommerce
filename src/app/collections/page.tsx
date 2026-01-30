'use client';

import Image from 'next/image';
import Link from 'next/link';
import { categories, events } from '@/data/products';
import './collections.css';

export default function CollectionsPage() {
    return (
        <div className="collections-page">
            <section className="collections-hero">
                <Image src="/images/ListCollections/pexels-ade-rifaie-9316569 1-12.png" alt="Collections" fill style={{ objectFit: 'cover' }} priority />
                <div className="hero-overlay">
                    <span className="hero-badge">Limited Time Offer</span>
                    <h1>Discount 30%</h1>
                    <p>Hijab pashmina</p>
                    <div className="hero-price">
                        <span className="sale-price">Rp70,000</span>
                        <span className="original-price">Rp100,000</span>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="islamic-divider-sm"><span className="islamic-pattern">❋</span></div>
                        <h2 className="section-title">Collections</h2>
                        <p className="section-subtitle">See all products that fall into this category</p>
                    </div>

                    <div className="collections-grid">
                        {categories.map((category) => (
                            <Link key={category.id} href={`/products?category=${category.slug}`} className="collection-card">
                                <div className="collection-image">
                                    <Image src={category.image} alt={category.name} fill style={{ objectFit: 'cover' }} />
                                    <div className="collection-overlay">
                                        <h3>{category.name}</h3>
                                        <span>{category.productCount} Products</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="events-section">
                <div className="container">
                    <div className="section-header">
                        <div className="islamic-divider-sm light"><span className="islamic-pattern">❋</span></div>
                        <h2 className="section-title light">Up coming event</h2>
                        <p className="section-subtitle light">Here are some of the events that are worth buying to discover.</p>
                    </div>

                    <div className="events-grid">
                        {events.map((event) => (
                            <div key={event.id} className="event-card">
                                <div className="event-image"><Image src={event.image} alt={event.title} fill style={{ objectFit: 'cover' }} /></div>
                                <h4>{event.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
