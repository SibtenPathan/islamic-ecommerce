'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import './analytics.css';

interface OverviewData {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    revenueGrowth: number;
    ordersGrowth: number;
}

interface SalesByDay {
    _id: string;
    revenue: number;
    orders: number;
}

interface TopProduct {
    _id: string;
    name: string;
    image: string;
    totalSold: number;
    revenue: number;
}

interface OrderByStatus {
    _id: string;
    count: number;
}

interface SalesByCategory {
    _id: string;
    revenue: number;
    count: number;
}

interface RecentOrder {
    _id: string;
    user: { name: string; email: string };
    total: number;
    status: string;
    createdAt: string;
}

export default function AnalyticsDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [salesByDay, setSalesByDay] = useState<SalesByDay[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [ordersByStatus, setOrdersByStatus] = useState<OrderByStatus[]>([]);
    const [salesByCategory, setSalesByCategory] = useState<SalesByCategory[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/analytics?period=${period}`);
            const data = await response.json();

            setOverview(data.overview);
            setSalesByDay(data.salesByDay || []);
            setTopProducts(data.topProducts || []);
            setOrdersByStatus(data.ordersByStatus || []);
            setSalesByCategory(data.salesByCategory || []);
            setRecentOrders(data.recentOrders || []);
        } catch (error) {
            console.error('Error fetching analytics:', error);
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: '#f5a623',
            processing: '#3498db',
            shipped: '#9b59b6',
            delivered: '#27ae60',
            cancelled: '#e74c3c',
        };
        return colors[status] || '#666';
    };

    const maxRevenue = Math.max(...salesByDay.map(d => d.revenue), 1);

    if (loading && !overview) {
        return (
            <div className="analytics-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <div>
                    <h1>Analytics Dashboard</h1>
                    <p>Monitor your store performance</p>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="period-select"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                </select>
            </div>

            {/* Overview Cards */}
            <div className="overview-cards">
                <div className="stat-card">
                    <div className="stat-icon revenue">₹</div>
                    <div className="stat-content">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">{formatCurrency(overview?.totalRevenue || 0)}</span>
                        <span className={`stat-change ${(overview?.revenueGrowth || 0) >= 0 ? 'positive' : 'negative'}`}>
                            {(overview?.revenueGrowth || 0) >= 0 ? '↑' : '↓'} {Math.abs(overview?.revenueGrowth || 0)}%
                        </span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orders">📦</div>
                    <div className="stat-content">
                        <span className="stat-label">Total Orders</span>
                        <span className="stat-value">{overview?.totalOrders || 0}</span>
                        <span className={`stat-change ${(overview?.ordersGrowth || 0) >= 0 ? 'positive' : 'negative'}`}>
                            {(overview?.ordersGrowth || 0) >= 0 ? '↑' : '↓'} {Math.abs(overview?.ordersGrowth || 0)}%
                        </span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon products">🏷️</div>
                    <div className="stat-content">
                        <span className="stat-label">Products</span>
                        <span className="stat-value">{overview?.totalProducts || 0}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon users">👥</div>
                    <div className="stat-content">
                        <span className="stat-label">Customers</span>
                        <span className="stat-value">{overview?.totalUsers || 0}</span>
                    </div>
                </div>
            </div>

            <div className="analytics-grid">
                {/* Sales Chart */}
                <div className="chart-card sales-chart">
                    <h3>Revenue Over Time</h3>
                    <div className="chart-container">
                        {salesByDay.length > 0 ? (
                            <div className="bar-chart">
                                {salesByDay.map((day) => (
                                    <div key={day._id} className="bar-item">
                                        <div
                                            className="bar"
                                            style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                                            title={`${formatCurrency(day.revenue)} - ${day.orders} orders`}
                                        ></div>
                                        <span className="bar-label">{formatDate(day._id)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No sales data for this period</p>
                        )}
                    </div>
                </div>

                {/* Order Status */}
                <div className="chart-card status-chart">
                    <h3>Orders by Status</h3>
                    <div className="status-list">
                        {ordersByStatus.map((item) => (
                            <div key={item._id} className="status-item">
                                <div className="status-info">
                                    <span
                                        className="status-dot"
                                        style={{ backgroundColor: getStatusColor(item._id) }}
                                    ></span>
                                    <span className="status-name">{item._id}</span>
                                </div>
                                <span className="status-count">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="chart-card top-products">
                    <h3>Top Selling Products</h3>
                    <div className="products-list">
                        {topProducts.map((product, index) => (
                            <div key={product._id} className="product-item">
                                <span className="product-rank">#{index + 1}</span>
                                <div className="product-image">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="product-info">
                                    <span className="product-name">{product.name}</span>
                                    <span className="product-sold">{product.totalSold} sold</span>
                                </div>
                                <span className="product-revenue">{formatCurrency(product.revenue)}</span>
                            </div>
                        ))}
                        {topProducts.length === 0 && (
                            <p className="no-data">No products sold in this period</p>
                        )}
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="chart-card category-chart">
                    <h3>Sales by Category</h3>
                    <div className="category-list">
                        {salesByCategory.map((category) => (
                            <div key={category._id} className="category-item">
                                <div className="category-info">
                                    <span className="category-name">{category._id}</span>
                                    <span className="category-count">{category.count} items</span>
                                </div>
                                <span className="category-revenue">{formatCurrency(category.revenue)}</span>
                            </div>
                        ))}
                        {salesByCategory.length === 0 && (
                            <p className="no-data">No category data available</p>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="chart-card recent-orders">
                    <div className="card-header">
                        <h3>Recent Orders</h3>
                        <Link href="/admin/orders" className="view-all">View All</Link>
                    </div>
                    <div className="orders-table">
                        {recentOrders.map((order) => (
                            <div key={order._id} className="order-row">
                                <div className="order-info">
                                    <span className="order-id">#{order._id.slice(-6)}</span>
                                    <span className="order-customer">{order.user?.name || 'Guest'}</span>
                                </div>
                                <span
                                    className="order-status"
                                    style={{ color: getStatusColor(order.status) }}
                                >
                                    {order.status}
                                </span>
                                <span className="order-total">{formatCurrency(order.total)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
