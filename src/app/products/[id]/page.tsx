'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { products } from '@/data/products';
import './detail.css';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const product = products.find(p => p.id === productId) || products[0];

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const relatedProducts = products.filter(p => p.id !== productId).slice(0, 4);
  const mergeProducts = products.slice(0, 4);

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'review', label: 'Review' },
    { id: 'comment', label: 'Comment' },
    { id: 'shipping', label: 'Shipping policy' },
    { id: 'size', label: 'Size chart' },
  ];

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-layout">
          <div className="product-image-section">
            <div className="main-image">
              <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} priority />
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price-row">
              <span className="current-price">US${product.price.toFixed(2)}</span>
              {product.originalPrice && <span className="original-price">US${product.originalPrice.toFixed(2)}</span>}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="option-section">
                <label className="option-label">Color</label>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <button key={index} className={`color-btn ${selectedColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }} onClick={() => setSelectedColor(color)} />
                  ))}
                </div>
              </div>
            )}

            <div className="option-section">
              <label className="option-label">Size</label>
              <div className="size-options">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button key={size} className={`size-btn ${selectedSize === size ? 'selected' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>
                ))}
              </div>
            </div>

            <div className="option-section">
              <label className="option-label">Quantity</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button className="add-to-cart-btn">Add to Cart</button>
          </div>

          <aside className="related-sidebar">
            <h3 className="sidebar-title">Related Product</h3>
            <div className="related-list">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="related-item">
                  <div className="related-image">
                    <Image src={relatedProduct.image} alt={relatedProduct.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="related-info">
                    <h4>{relatedProduct.name}</h4>
                    <span className="related-price">US${relatedProduct.price.toFixed(2)}</span>
                    <button className="related-btn">Select</button>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <div className="product-tabs">
          <div className="tabs-header">
            {tabs.map((tab) => (
              <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <h4>Specification:</h4>
                <ol>
                  {product.specifications?.map((spec, index) => <li key={index}>{spec}</li>) || (
                    <>
                      <li>The material is soft</li>
                      <li>Not easy to wrinkle</li>
                      <li>Quality materials</li>
                      <li>Comfortable to wear everyday</li>
                    </>
                  )}
                </ol>
              </div>
            )}
            {activeTab === 'review' && <div className="review-content"><p>No reviews yet.</p></div>}
            {activeTab === 'comment' && <div className="comment-content"><p>No comments yet.</p></div>}
            {activeTab === 'shipping' && <div className="shipping-content"><p>Free shipping on orders over $50.</p></div>}
            {activeTab === 'size' && <div className="size-content"><p>Please refer to our size guide.</p></div>}
          </div>
        </div>

        <section className="merge-section">
          <div className="section-header">
            <div className="islamic-divider-sm"><span className="islamic-pattern">❋</span></div>
            <h2 className="section-title">Merge Products</h2>
            <p className="section-subtitle">See the products you can combine</p>
          </div>
          <div className="merge-products">
            {mergeProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
