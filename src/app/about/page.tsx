'use client';

import Image from 'next/image';
import { companyStats } from '@/data/products';
import './about.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="hero-container">
          <div className="hero-image"><Image src="/images/AboutUs/rachelle-magpayo-YtVsAUt5ubs-unsplash 1-1.png" alt="About Müslüman" fill style={{ objectFit: 'cover' }} priority /></div>
          <div className="hero-content">
            <div className="section-header">
              <div className="islamic-divider-sm"><span className="islamic-pattern">❋</span></div>
              <h2>We Are</h2>
            </div>
            <p className="about-text">The largest Muslim clothing manufacturer in Asia. We have been established since 2004 and have exported brands to various countries.</p>
            <p className="about-text">We started to expand our business in Muslim clothing around the world in 2015, and we have been trusted by many clients as the best Muslim clothing manufacturer.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {companyStats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
                <span className="stat-number" style={{ color: stat.color }}>{index + 1}</span>
                <div className="stat-content">
                  <h3 className="stat-label">{stat.label}</h3>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <div className="section-header"><div className="islamic-divider-sm"><span className="islamic-pattern">❋</span></div><h2 className="section-title">Gallery</h2></div>
          <div className="gallery-grid">
            <div className="gallery-item large"><Image src="/images/AboutUs/nasik-lababan-fsFkqGieDg0-unsplash 1-2.png" alt="Gallery 1" fill style={{ objectFit: 'cover' }} /></div>
            <div className="gallery-item"><Image src="/images/AboutUs/nasik-lababan-wFfTPkoDhEo-unsplash-3.png" alt="Gallery 2" fill style={{ objectFit: 'cover' }} /></div>
            <div className="gallery-item"><Image src="/images/AboutUs/nasik-lababan-m0Ym3mjeRFE-unsplash-4.png" alt="Gallery 3" fill style={{ objectFit: 'cover' }} /></div>
            <div className="gallery-item"><Image src="/images/AboutUs/pexels-asep-syaeful-bahri-5580168-5.png" alt="Gallery 4" fill style={{ objectFit: 'cover' }} /></div>
          </div>
        </div>
      </section>

      <section className="social-section">
        <div className="container">
          <h3 className="social-title">Our Social Media</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              <span>@müslüman</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" /></svg>
              <span>@müslümanstore</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              <span>@müslümantrack</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
