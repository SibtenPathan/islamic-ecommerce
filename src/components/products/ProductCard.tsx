'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/data/products';
import './ProductCard.css';

interface ProductCardProps {
  product: Product & { _id?: string };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Handle both MongoDB _id and legacy numeric id
  const productId = product._id || String(product.id);
  const productLink = product._id ? `/products/${product._id}` : `/products/${product.id}`;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await addToCart(productId);
  };

  return (
    <Link href={productLink} className="product-card">
      <div className="product-image">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
        {product.isNew && <span className="badge badge-new">New</span>}
        {product.originalPrice && (
          <span className="badge badge-sale">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% Off
          </span>
        )}
        <div className="product-overlay">
          <button className="quick-view-btn">Quick View</button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="current-price">US${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">US${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="product-colors">
            {product.colors.slice(0, 4).map((color, index) => (
              <span
                key={index}
                className="color-dot"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
        <button className="add-btn" onClick={handleAddToCart}>Add</button>
      </div>
    </Link>
  );
}
