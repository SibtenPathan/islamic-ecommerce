'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    totalRevenue: number;
    ordersByStatus: {
        pending: number;
        confirmed: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
}

interface RecentOrder {
    _id: string;
    user: { name: string; email: string } | null;
    total: number;
    status: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await fetch('/api/admin/dashboard');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setRecentOrders(data.recentOrders || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
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
                    <h2>Dashboard</h2>
                </header>
                <div className="admin-content">
                    <div className="admin-loading">Loading dashboard...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="admin-header">
                <h2>Dashboard</h2>
                <div className="admin-header-actions">
                    <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
                        + Add Product
                    </Link>
                </div>
            </header>
            <div className="admin-content">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon orders">🛒</div>
                        </div>
                        <div className="stat-card-value">{stats?.totalOrders || 0}</div>
                        <div className="stat-card-label">Total Orders</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon revenue">💰</div>
                        </div>
                        <div className="stat-card-value">{formatCurrency(stats?.totalRevenue || 0)}</div>
                        <div className="stat-card-label">Total Revenue</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon users">👥</div>
                        </div>
                        <div className="stat-card-value">{stats?.totalUsers || 0}</div>
                        <div className="stat-card-label">Total Users</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon products">📦</div>
                        </div>
                        <div className="stat-card-value">{stats?.totalProducts || 0}</div>
                        <div className="stat-card-label">Total Products</div>
                    </div>
                </div>

                {/* Order Status Summary */}
                <div className="admin-table-container" style={{ marginBottom: '32px' }}>
                    <div className="admin-table-header">
                        <h3>Orders by Status</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', padding: '20px 24px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="status-badge pending">Pending</span>
                            <strong>{stats?.ordersByStatus.pending || 0}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="status-badge confirmed">Confirmed</span>
                            <strong>{stats?.ordersByStatus.confirmed || 0}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="status-badge shipped">Shipped</span>
                            <strong>{stats?.ordersByStatus.shipped || 0}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="status-badge delivered">Delivered</span>
                            <strong>{stats?.ordersByStatus.delivered || 0}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="status-badge cancelled">Cancelled</span>
                            <strong>{stats?.ordersByStatus.cancelled || 0}</strong>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>Recent Orders</h3>
                        <Link href="/admin/orders" className="admin-btn admin-btn-secondary admin-btn-sm">
                            View All
                        </Link>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: '#6b6b6b' }}>
                                        No orders yet
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <Link href={`/admin/orders/${order._id}`} style={{ color: '#C4A77D' }}>
                                                #{order._id.slice(-8)}
                                            </Link>
                                        </td>
                                        <td>{order.user?.name || 'Unknown'}</td>
                                        <td>{formatCurrency(order.total)}</td>
                                        <td>
                                            <span className={`status-badge ${order.status}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
