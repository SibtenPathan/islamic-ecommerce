'use client';

import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/data/products';
import './blog.css';

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="blog-page">
      <div className="search-header">
        <div className="container">
          <div className="search-bar">
            <input type="text" placeholder="Search articles..." className="search-input" />
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <section className="featured-section">
        <div className="container">
          <Link href={`/blog/${featuredPost.slug}`} className="featured-card">
            <div className="featured-image"><Image src="/images/Blog/image 38-12.png" alt={featuredPost.title} fill style={{ objectFit: 'cover' }} priority /></div>
            <div className="featured-content">
              <span className="category-tag">{featuredPost.category}</span>
              <h1>{featuredPost.title}</h1>
              <p>{featuredPost.excerpt}</p>
              <div className="article-meta"><span>{featuredPost.author}</span><span>•</span><span>{featuredPost.date}</span><span>•</span><span>{featuredPost.readTime}</span></div>
            </div>
          </Link>
        </div>
      </section>

      <section className="articles-section">
        <div className="container">
          <div className="articles-grid">
            {otherPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="article-card">
                <div className="article-image"><Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} /></div>
                <div className="article-content">
                  <span className="category-tag small">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="article-meta"><span>{post.date}</span><span>•</span><span>{post.readTime}</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
