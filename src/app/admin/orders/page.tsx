'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

interface Order {
    _id: string;
    user: { name: string; email: string } | null;
    items: { name: string; quantity: number }[];
    total: number;
    status: string;
    shippingAddress: {
        fullName: string;
        city: string;
        country: string;
    };
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/admin/orders?${params}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                showToast('Order status updated!', 'success');
                fetchOrders(pagination?.page || 1);
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            showToast('Failed to update status', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <>
            <header className="admin-header">
                <h2>Orders</h2>
            </header>
            <div className="admin-content">
                {/* Filters */}
                <div className="admin-search">
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Orders Table */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>All Orders ({pagination?.total || 0})</h3>
                    </div>
                    {loading ? (
                        <div className="admin-loading">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty-icon">🛒</div>
                            <p>No orders found</p>
                        </div>
                    ) : (
                        <>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>
                                                <Link href={`/admin/orders/${order._id}`} style={{ color: '#C4A77D', fontWeight: 500 }}>
                                                    #{order._id.slice(-8)}
                                                </Link>
                                            </td>
                                            <td>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{order.user?.name || order.shippingAddress.fullName}</div>
                                                    <div style={{ fontSize: '12px', color: '#6b6b6b' }}>{order.user?.email || '-'}</div>
                                                </div>
                                            </td>
                                            <td>
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                                            <td>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                                    disabled={updatingId === order._id}
                                                    className="admin-filter-select"
                                                    style={{
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        minWidth: '120px',
                                                        opacity: updatingId === order._id ? 0.5 : 1
                                                    }}
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Link
                                                    href={`/admin/orders/${order._id}`}
                                                    className="admin-btn admin-btn-secondary admin-btn-sm"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {pagination && pagination.pages > 1 && (
                                <div className="admin-pagination">
                                    <button
                                        className="admin-pagination-btn"
                                        disabled={pagination.page === 1}
                                        onClick={() => fetchOrders(pagination.page - 1)}
                                    >
                                        ←
                                    </button>
                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            className={`admin-pagination-btn ${page === pagination.page ? 'active' : ''}`}
                                            onClick={() => fetchOrders(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        className="admin-pagination-btn"
                                        disabled={pagination.page === pagination.pages}
                                        onClick={() => fetchOrders(pagination.page + 1)}
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
