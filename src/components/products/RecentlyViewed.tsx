'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import './RecentlyViewed.css';

export default function RecentlyViewed() {
    const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

    if (recentlyViewed.length === 0) {
        return null;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <section className="recently-viewed-section">
            <div className="section-header">
                <h2>Recently Viewed</h2>
                <button onClick={clearRecentlyViewed} className="clear-btn">
                    Clear All
                </button>
            </div>
            <div className="recently-viewed-scroll">
                {recentlyViewed.map((product) => (
                    <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        className="recently-viewed-item"
                    >
                        <div className="item-image">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="item-info">
                            <span className="item-category">{product.category}</span>
                            <h4 className="item-name">{product.name}</h4>
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
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
