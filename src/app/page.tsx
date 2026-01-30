'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import HeroCarousel from '@/components/home/HeroCarousel';
import EventsSection from '@/components/home/EventsSection';
import { categories } from '@/data/products';
import './home.css';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors?: string[];
  sizes?: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="home-page">
      {/* Hero Carousel - Dynamic from Admin */}
      <HeroCarousel />

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div className="islamic-divider-sm">
              <span className="islamic-pattern">❋</span>
            </div>
            <h2 className="section-title">Categories</h2>
            <p className="section-subtitle">See all products that fall into this category</p>
          </div>

          <div className="categories-grid">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="category-card"
              >
                <div className="category-image">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="category-overlay">
                    <h3 className="category-name">{category.name}</h3>
                    <span className="category-count">{category.productCount} Products</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="section bestseller-section">
        <div className="container">
          <div className="section-header">
            <div className="islamic-divider-sm">
              <span className="islamic-pattern">❋</span>
            </div>
            <h2 className="section-title">Best Seller</h2>
            <p className="section-subtitle">See all products and see the one that suits you</p>
          </div>

          <div className="products-grid">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="section trending-section">
        <div className="container">
          <div className="section-header">
            <div className="islamic-divider-sm">
              <span className="islamic-pattern">❋</span>
            </div>
            <h2 className="section-title">Trending</h2>
            <p className="section-subtitle">Discover trending styles loved by our customers</p>
          </div>

          <div className="products-grid">
            {trendingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Trending Gallery */}
          <div className="trending-gallery">
            <div className="gallery-item gallery-large">
              <Image
                src="/images/Home1/image 94-21.png"
                alt="Trending Style 1"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="gallery-item">
              <Image
                src="/images/Home1/image 95-17.png"
                alt="Trending Style 2"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="gallery-item">
              <Image
                src="/images/Home1/image 96-20.png"
                alt="Trending Style 3"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="gallery-item">
              <Image
                src="/images/Home1/image 97-19.png"
                alt="Trending Style 4"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Section - Dynamic from Admin */}
      <EventsSection />
    </div>
  );
}
