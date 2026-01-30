'use client';

import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/data/products';
import './article.css';

export default function BlogArticlePage() {
  const article = blogPosts[0];
  const relatedPosts = blogPosts.slice(1, 4);

  return (
    <div className="article-page">
      <div className="container">
        <article className="article">
          <header className="article-header">
            <Link href="/blog" className="back-link">← Back to Blog</Link>
            <h1>{article.title}</h1>
            <div className="article-meta"><span className="author">{article.author}</span><span>•</span><span>{article.date}</span><span>•</span><span>{article.readTime}</span></div>
          </header>

          <div className="featured-image"><Image src="/images/BlogArticle/image 64-1.png" alt={article.title} fill style={{ objectFit: 'cover' }} priority /></div>

          <div className="article-content">
            <p>Mosques are not just places of worship; they are architectural marvels that reflect the rich cultural heritage and artistic excellence of Islamic civilization.</p>
            <h2>1. Masjid al-Haram, Mecca</h2>
            <div className="content-image"><Image src="/images/BlogArticle/pexels-mohammed-zayed-6169629 2-2.png" alt="Masjid al-Haram" width={800} height={400} style={{ objectFit: 'cover', width: '100%', height: 'auto' }} /></div>
            <p>The most sacred mosque in Islam, Masjid al-Haram surrounds the Kaaba in Mecca.</p>
            <h2>2. Al-Masjid an-Nabawi, Medina</h2>
            <p>The Prophet&apos;s Mosque in Medina is the second holiest site in Islam.</p>
            <h2>3. Sheikh Zayed Grand Mosque, Abu Dhabi</h2>
            <p>A masterpiece of modern Islamic architecture with 82 domes and over 1,000 columns.</p>
          </div>

          <div className="author-bio">
            <div className="author-avatar"><Image src="/images/BlogArticle/Ellipse 18-4.png" alt="Author" fill style={{ objectFit: 'cover' }} /></div>
            <div className="author-info"><h4>{article.author}</h4><p>Editorial team at Müslüman, sharing insights about Islamic culture, fashion, and lifestyle.</p></div>
          </div>

          <div className="comments-section">
            <h3>Leave a Comment</h3>
            <form className="comment-form">
              <textarea placeholder="Write your comment..." rows={4}></textarea>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </article>

        <aside className="related-section">
          <h3>Other Articles</h3>
          <div className="related-grid">
            {relatedPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="related-card">
                <div className="related-image"><Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} /></div>
                <h4>{post.title}</h4>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
