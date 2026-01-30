'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

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
    user: { name: string; email: string; phone?: string } | null;
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
    updatedAt: string;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetail({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
            } else {
                showToast('Order not found', 'error');
                router.push('/admin/orders');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                showToast('Status updated successfully!', 'success');
                fetchOrder();
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Failed to update status', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    if (loading) {
        return (
            <>
                <header className="admin-header">
                    <h2>Order Details</h2>
                </header>
                <div className="admin-content">
                    <div className="admin-loading">Loading order...</div>
                </div>
            </>
        );
    }

    if (!order) return null;

    return (
        <>
            <header className="admin-header">
                <h2>Order #{order._id.slice(-8)}</h2>
                <div className="admin-header-actions">
                    <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => router.push('/admin/orders')}
                    >
                        ← Back to Orders
                    </button>
                </div>
            </header>
            <div className="admin-content">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    {/* Left Column - Order Items */}
                    <div>
                        <div className="admin-table-container" style={{ marginBottom: '24px' }}>
                            <div className="admin-table-header">
                                <h3>Order Items</h3>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: 500 }}>{item.name}</div>
                                                        {(item.selectedColor || item.selectedSize) && (
                                                            <div style={{ fontSize: '12px', color: '#6b6b6b' }}>
                                                                {item.selectedColor && `Color: ${item.selectedColor}`}
                                                                {item.selectedColor && item.selectedSize && ' | '}
                                                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{formatCurrency(item.price)}</td>
                                            <td>{item.quantity}</td>
                                            <td style={{ fontWeight: 500 }}>{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ padding: '20px 24px', borderTop: '1px solid #e5e5e5', textAlign: 'right' }}>
                                <span style={{ fontSize: '18px', fontWeight: 600 }}>
                                    Total: {formatCurrency(order.total)}
                                </span>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="admin-table-container">
                            <div className="admin-table-header">
                                <h3>Shipping Address</h3>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <p style={{ margin: '0 0 8px', fontWeight: 500 }}>{order.shippingAddress.fullName}</p>
                                <p style={{ margin: '0 0 4px', color: '#6b6b6b' }}>{order.shippingAddress.address}</p>
                                <p style={{ margin: '0 0 4px', color: '#6b6b6b' }}>
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </p>
                                <p style={{ margin: '0 0 8px', color: '#6b6b6b' }}>{order.shippingAddress.country}</p>
                                <p style={{ margin: 0 }}>📞 {order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Status */}
                    <div>
                        <div className="admin-table-container" style={{ marginBottom: '24px' }}>
                            <div className="admin-table-header">
                                <h3>Order Status</h3>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label className="admin-form-label" style={{ marginBottom: '8px', display: 'block' }}>
                                        Current Status
                                    </label>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(e.target.value)}
                                        disabled={updating}
                                        className="admin-form-select"
                                        style={{ width: '100%', opacity: updating ? 0.5 : 1 }}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {statusOptions.map((status) => (
                                        <div
                                            key={status}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                opacity: statusOptions.indexOf(status) <= statusOptions.indexOf(order.status) ? 1 : 0.4
                                            }}
                                        >
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: statusOptions.indexOf(status) <= statusOptions.indexOf(order.status) ? '#28a745' : '#e5e5e5',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px'
                                            }}>
                                                ✓
                                            </div>
                                            <span style={{ textTransform: 'capitalize' }}>{status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="admin-table-container">
                            <div className="admin-table-header">
                                <h3>Customer</h3>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <p style={{ margin: '0 0 4px', fontWeight: 500 }}>{order.user?.name || 'Guest'}</p>
                                <p style={{ margin: '0 0 4px', color: '#6b6b6b' }}>{order.user?.email || '-'}</p>
                                {order.user?.phone && (
                                    <p style={{ margin: 0, color: '#6b6b6b' }}>📞 {order.user.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="admin-table-container" style={{ marginTop: '24px' }}>
                            <div className="admin-table-header">
                                <h3>Order Info</h3>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#6b6b6b' }}>Order Date</span>
                                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#6b6b6b' }}>Last Updated</span>
                                    <span>{new Date(order.updatedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
