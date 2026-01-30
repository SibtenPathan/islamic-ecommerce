'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import './cart.css';

export default function CartPage() {
    const { data: session, status } = useSession();
    const { items, total, loading, updateQuantity, removeFromCart } = useCart();

    if (status === 'loading') {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="loading-state">Loading...</div>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="empty-cart">
                        <div className="islamic-divider-sm">
                            <span className="islamic-pattern">❋</span>
                        </div>
                        <h2>Please Login</h2>
                        <p>You need to be logged in to view your cart.</p>
                        <Link href="/login" className="btn-primary">Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="empty-cart">
                        <div className="islamic-divider-sm">
                            <span className="islamic-pattern">❋</span>
                        </div>
                        <h2>Your Cart is Empty</h2>
                        <p>Start shopping to add items to your cart.</p>
                        <Link href="/products" className="btn-primary">Browse Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <div className="islamic-divider-sm">
                        <span className="islamic-pattern">❋</span>
                    </div>
                    <h1>Shopping Cart</h1>
                    <p>Hi {session?.user?.name}, you have {items.length} item(s) in your cart</p>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.product._id} className="cart-item">
                                <div className="item-image">
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="item-details">
                                    <span className="item-category">{item.product.category}</span>
                                    <h3 className="item-name">{item.product.name}</h3>
                                    {(item.selectedColor || item.selectedSize) && (
                                        <div className="item-options">
                                            {item.selectedColor && (
                                                <span
                                                    className="option-color"
                                                    style={{ backgroundColor: item.selectedColor }}
                                                />
                                            )}
                                            {item.selectedSize && (
                                                <span className="option-size">Size: {item.selectedSize}</span>
                                            )}
                                        </div>
                                    )}
                                    <span className="item-price">₹{item.product.price.toFixed(2)}</span>
                                </div>
                                <div className="item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                        disabled={loading || item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        disabled={loading}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="item-subtotal">
                                    ₹{(item.product.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    className="item-remove"
                                    onClick={() => removeFromCart(item.product._id)}
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" className="checkout-btn">
                            Proceed to Checkout
                        </Link>
                        <Link href="/products" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
