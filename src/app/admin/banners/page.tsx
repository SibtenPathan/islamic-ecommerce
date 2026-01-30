'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './banners.css';

interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    buttonText?: string;
    order: number;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
}

const initialFormData = {
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: 'Shop Now',
    order: 0,
    isActive: true,
    startDate: '',
    endDate: '',
};

export default function BannersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchBanners();
        }
    }, [status, router]);

    const fetchBanners = async () => {
        try {
            const response = await fetch('/api/admin/banners?admin=true');
            const data = await response.json();
            setBanners(data.banners || []);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const url = '/api/admin/banners';
            const method = editingBanner ? 'PUT' : 'POST';
            const body = editingBanner ? { id: editingBanner._id, ...formData } : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `Banner ${editingBanner ? 'updated' : 'created'} successfully!` });
                fetchBanners();
                resetForm();
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save banner' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            const response = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Banner deleted successfully!' });
                fetchBanners();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete banner' });
        }
    };

    const toggleActive = async (banner: Banner) => {
        try {
            await fetch('/api/admin/banners', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: banner._id, isActive: !banner.isActive }),
            });
            fetchBanners();
        } catch (error) {
            console.error('Error toggling banner:', error);
        }
    };

    const editBanner = (banner: Banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            image: banner.image,
            link: banner.link || '',
            buttonText: banner.buttonText || 'Shop Now',
            order: banner.order,
            isActive: banner.isActive,
            startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
            endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingBanner(null);
        setFormData(initialFormData);
    };

    if (loading) {
        return (
            <div className="banners-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading banners...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="banners-page">
            <div className="page-header">
                <h1>Banner Management</h1>
                {!showForm && (
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        + Add Banner
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            {showForm && (
                <form className="banner-form" onSubmit={handleSubmit}>
                    <h2>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Link URL</label>
                            <input
                                type="text"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="/products or https://..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Button Text</label>
                            <input
                                type="text"
                                value={formData.buttonText}
                                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Display Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                min="0"
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

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date (optional)</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date (optional)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                        <button type="submit" className="submit-btn">
                            {editingBanner ? 'Update' : 'Add'} Banner
                        </button>
                    </div>
                </form>
            )}

            <div className="banners-grid">
                {banners.length === 0 ? (
                    <p className="no-data">No banners found. Create your first banner!</p>
                ) : (
                    banners.map((banner) => (
                        <div key={banner._id} className={`banner-card ${!banner.isActive ? 'inactive' : ''}`}>
                            <div className="banner-preview">
                                <Image
                                    src={banner.image}
                                    alt={banner.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                <span className={`status-badge ${banner.isActive ? 'active' : 'inactive'}`}>
                                    {banner.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="banner-info">
                                <h3>{banner.title}</h3>
                                {banner.subtitle && <p>{banner.subtitle}</p>}
                                <span className="banner-order">Order: {banner.order}</span>
                            </div>
                            <div className="banner-actions">
                                <button onClick={() => toggleActive(banner)}>
                                    {banner.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => editBanner(banner)}>Edit</button>
                                <button className="delete" onClick={() => handleDelete(banner._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
