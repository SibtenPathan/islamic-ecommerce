'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './coupons.css';

interface Coupon {
    _id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minPurchase: number;
    maxDiscount?: number;
    maxUses: number;
    usedCount: number;
    expiresAt: string;
    isActive: boolean;
    createdAt: string;
}

const initialFormData = {
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minPurchase: 0,
    maxDiscount: 0,
    maxUses: -1,
    expiresAt: '',
    isActive: true,
};

export default function CouponsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchCoupons();
        }
    }, [status, router]);

    const fetchCoupons = async () => {
        try {
            const response = await fetch('/api/admin/coupons');
            const data = await response.json();
            setCoupons(data.coupons || []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const url = '/api/admin/coupons';
            const method = editingCoupon ? 'PUT' : 'POST';
            const body = editingCoupon ? { id: editingCoupon._id, ...formData } : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `Coupon ${editingCoupon ? 'updated' : 'created'} successfully!` });
                fetchCoupons();
                resetForm();
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save coupon' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const response = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Coupon deleted successfully!' });
                fetchCoupons();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete coupon' });
        }
    };

    const toggleActive = async (coupon: Coupon) => {
        try {
            await fetch('/api/admin/coupons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: coupon._id, isActive: !coupon.isActive }),
            });
            fetchCoupons();
        } catch (error) {
            console.error('Error toggling coupon:', error);
        }
    };

    const editCoupon = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minPurchase: coupon.minPurchase || 0,
            maxDiscount: coupon.maxDiscount || 0,
            maxUses: coupon.maxUses,
            expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
            isActive: coupon.isActive,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingCoupon(null);
        setFormData(initialFormData);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="coupons-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading coupons...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="coupons-page">
            <div className="page-header">
                <h1>Coupon Management</h1>
                {!showForm && (
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        + Create Coupon
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            {showForm && (
                <form className="coupon-form" onSubmit={handleSubmit}>
                    <h2>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Coupon Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="e.g., SUMMER20"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Expiry Date</label>
                            <input
                                type="date"
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Discount Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Discount Value</label>
                            <input
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Minimum Purchase Amount</label>
                            <input
                                type="number"
                                value={formData.minPurchase}
                                onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Maximum Discount (for %)</label>
                            <input
                                type="number"
                                value={formData.maxDiscount}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Max Uses (-1 = unlimited)</label>
                            <input
                                type="number"
                                value={formData.maxUses}
                                onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                            />
                        </div>
                        <div className="form-group checkbox">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            <label htmlFor="isActive">Active</label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                        <button type="submit" className="submit-btn">
                            {editingCoupon ? 'Update' : 'Create'} Coupon
                        </button>
                    </div>
                </form>
            )}

            <div className="coupons-table">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Min. Purchase</th>
                            <th>Usage</th>
                            <th>Expires</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.length === 0 ? (
                            <tr><td colSpan={7} className="no-data">No coupons found</td></tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon._id}>
                                    <td>
                                        <span className="coupon-code">{coupon.code}</span>
                                    </td>
                                    <td>
                                        {coupon.type === 'percentage'
                                            ? `${coupon.value}%`
                                            : formatCurrency(coupon.value)}
                                    </td>
                                    <td>{coupon.minPurchase ? formatCurrency(coupon.minPurchase) : '-'}</td>
                                    <td>
                                        {coupon.usedCount}{coupon.maxUses !== -1 ? ` / ${coupon.maxUses}` : ' / ∞'}
                                    </td>
                                    <td>
                                        {new Date(coupon.expiresAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            className={`status-toggle ${coupon.isActive ? 'active' : 'inactive'}`}
                                            onClick={() => toggleActive(coupon)}
                                        >
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button onClick={() => editCoupon(coupon)}>Edit</button>
                                            <button className="delete" onClick={() => handleDelete(coupon._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
