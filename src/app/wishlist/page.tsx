'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import './wishlist.css';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
}

export default function WishlistPage() {
    const { data: session } = useSession();
    const { wishlist, isLoading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        await removeFromWishlist(productId);
        setRemovingId(null);
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product._id);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="wishlist-page">
                <div className="wishlist-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading your wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <h1>My Wishlist</h1>
                    <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="empty-wishlist">
                        <div className="empty-icon">❤️</div>
                        <h2>Your wishlist is empty</h2>
                        <p>Save items you love by clicking the heart icon on products</p>
                        <Link href="/products" className="browse-btn">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map((product) => (
                            <div key={product._id} className="wishlist-item">
                                <div className="item-image">
                                    <Link href={`/products/${product._id}`}>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </Link>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(product._id)}
                                        disabled={removingId === product._id}
                                        title="Remove from wishlist"
                                    >
                                        {removingId === product._id ? '...' : '×'}
                                    </button>
                                </div>
                                <div className="item-details">
                                    <span className="item-category">{product.category}</span>
                                    <Link href={`/products/${product._id}`}>
                                        <h3 className="item-name">{product.name}</h3>
                                    </Link>
                                    <div className="item-price">
                                        <span className="current-price">
                                            {formatCurrency(product.price)}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="original-price">
                                                {formatCurrency(product.originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
