'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { products, categories, events } from '@/data/products';
import './home.css';

export default function HomePage() {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">Limited Time Offer</span>
            <h1 className="hero-title">Discount 30%</h1>
            <p className="hero-subtitle">Women Dress Maroon</p>
            <div className="hero-price">
              <span className="sale-price">Rp540.00</span>
              <span className="original-price">Rp700.00</span>
            </div>
            <Link href="/products" className="hero-btn">
              Shop Now
            </Link>
          </div>
          <div className="hero-image">
            <Image
              src="/images/Home1/Image-1.png"
              alt="Women Dress Collection"
              fill
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              priority
            />
          </div>
        </div>
      </section>

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
              <ProductCard key={product.id} product={product} />
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
              <ProductCard key={product.id} product={product} />
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

      {/* Upcoming Event Banner */}
      <section className="event-banner">
        <div className="event-container">
          <div className="event-content">
            <div className="islamic-divider-sm light">
              <span className="islamic-pattern">❋</span>
            </div>
            <h2 className="event-title">Up coming event</h2>
            <p className="event-subtitle">
              Here are some of the events that are worth buying to discover.
            </p>
            <div className="event-cards">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-card-image">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h4 className="event-card-title">{event.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
