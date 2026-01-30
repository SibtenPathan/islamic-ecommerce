'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './orders.css';

interface OrderItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedColor?: string;
    selectedSize?: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    total: number;
    status: string;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    createdAt: string;
}

export default function OrdersPage() {
    const { status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (orderStatus: string) => {
        switch (orderStatus) {
            case 'pending':
                return '#f59e0b';
            case 'confirmed':
                return '#3b82f6';
            case 'shipped':
                return '#8b5cf6';
            case 'delivered':
                return '#10b981';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#6B6B6B';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (status === 'loading' || loading) {
        return (
            <div className="orders-page">
                <div className="orders-container">
                    <div className="loading-state">Loading orders...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-container">
                <div className="orders-header">
                    <div className="islamic-divider-sm">
                        <span className="islamic-pattern">❋</span>
                    </div>
                    <h1>My Orders</h1>
                    <p>Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="islamic-divider-sm">
                            <span className="islamic-pattern">❋</span>
                        </div>
                        <h2>No Orders Yet</h2>
                        <p>Start shopping to see your orders here.</p>
                        <Link href="/products" className="btn-primary">Browse Products</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <span className="order-id">Order #{order._id.slice(-8)}</span>
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <span
                                        className="order-status"
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <div className="order-item-image">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="order-item-details">
                                                <span className="order-item-name">{item.name}</span>
                                                <span className="order-item-qty">Qty: {item.quantity}</span>
                                                {(item.selectedColor || item.selectedSize) && (
                                                    <span className="order-item-options">
                                                        {item.selectedSize && `Size: ${item.selectedSize}`}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="order-item-price">
                                                US${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="shipping-info">
                                        <span className="shipping-label">Shipping to:</span>
                                        <span className="shipping-address">
                                            {order.shippingAddress.fullName}, {order.shippingAddress.address},{' '}
                                            {order.shippingAddress.city}, {order.shippingAddress.country}
                                        </span>
                                    </div>
                                    <div className="order-total">
                                        <span>Total:</span>
                                        <span className="total-amount">US${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
