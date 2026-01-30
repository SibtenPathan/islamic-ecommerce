'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import './checkout.css';

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { items, total, refreshCart } = useCart();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [hasExistingAddress, setHasExistingAddress] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
    });

    // Fetch user profile to pre-fill address
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (status !== 'authenticated') {
                setLoadingProfile(false);
                return;
            }

            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    const user = data.user;

                    // Pre-fill from user profile
                    if (user.address || user.phone) {
                        setHasExistingAddress(true);
                        setShippingAddress((prev) => ({
                            ...prev,
                            fullName: prev.fullName || user.name || '',
                            address: prev.address || user.address?.street || '',
                            city: prev.city || user.address?.city || '',
                            postalCode: prev.postalCode || user.address?.postalCode || '',
                            country: prev.country || user.address?.country || '',
                            phone: prev.phone || user.phone || '',
                        }));
                    } else {
                        // At least pre-fill the name
                        setShippingAddress((prev) => ({
                            ...prev,
                            fullName: prev.fullName || user.name || '',
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, [status]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shippingAddress }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to place order');
                showToast(data.error || 'Failed to place order', 'error');
                return;
            }

            // Also save the address to user profile for future use
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: shippingAddress.phone,
                    address: {
                        street: shippingAddress.address,
                        city: shippingAddress.city,
                        postalCode: shippingAddress.postalCode,
                        country: shippingAddress.country,
                    },
                }),
            });

            setOrderPlaced(true);
            setOrderId(data.order.id);
            showToast('Order placed successfully!', 'success');
            refreshCart();
        } catch {
            setError('Something went wrong');
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="loading-state">Loading...</div>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    if (orderPlaced) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="order-success">
                        <div className="success-icon">✓</div>
                        <div className="islamic-divider-sm">
                            <span className="islamic-pattern">❋</span>
                        </div>
                        <h2>Order Placed Successfully!</h2>
                        <p>Thank you for your order, {session?.user?.name}!</p>
                        <p className="order-id">Order ID: {orderId}</p>
                        <div className="success-actions">
                            <Link href="/orders" className="btn-primary">View Orders</Link>
                            <Link href="/products" className="btn-secondary">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="empty-cart">
                        <div className="islamic-divider-sm">
                            <span className="islamic-pattern">❋</span>
                        </div>
                        <h2>Your Cart is Empty</h2>
                        <p>Add items to your cart before checkout.</p>
                        <Link href="/products" className="btn-primary">Browse Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <div className="islamic-divider-sm">
                        <span className="islamic-pattern">❋</span>
                    </div>
                    <h1>Checkout</h1>
                </div>

                <div className="checkout-content">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <h3>Shipping Address</h3>

                        {error && <div className="checkout-error">{error}</div>}

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={shippingAddress.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={shippingAddress.address}
                                onChange={handleInputChange}
                                placeholder="Enter your street address"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={shippingAddress.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={shippingAddress.country}
                                onChange={handleInputChange}
                                placeholder="Enter your country"
                                required
                            />
                        </div>

                        <button type="submit" className="place-order-btn" disabled={loading}>
                            {loading ? 'Placing Order...' : `Place Order - ₹${total.toFixed(2)}`}
                        </button>
                    </form>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {items.map((item) => (
                                <div key={item.product._id} className="summary-item">
                                    <div className="summary-item-image">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <span className="item-qty">{item.quantity}</span>
                                    </div>
                                    <div className="summary-item-info">
                                        <span className="item-name">{item.product.name}</span>
                                        <span className="item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-totals">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
