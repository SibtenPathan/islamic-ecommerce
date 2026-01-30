'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import './ProductCard.css';

// Flexible product type that works with both MongoDB and legacy products
interface ProductCardProduct {
  _id?: string;
  id?: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

interface ProductCardProps {
  product: ProductCardProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

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
        <button
          className={`wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isInWishlist(productId)) {
              removeFromWishlist(productId);
            } else {
              addToWishlist({
                _id: productId,
                name: product.name,
                category: product.category,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
              });
            }
          }}
          title={isInWishlist(productId) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isInWishlist(productId) ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="current-price">₹{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
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
