'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

export default function NewProduct() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        image: '',
        colors: '',
        sizes: '',
        material: '',
        description: '',
        specifications: '',
        stock: '100',
        isNewArrival: false,
        isBestSeller: false,
        isTrending: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                image: formData.image,
                colors: formData.colors ? formData.colors.split(',').map((c) => c.trim()) : [],
                sizes: formData.sizes ? formData.sizes.split(',').map((s) => s.trim()) : [],
                material: formData.material || undefined,
                description: formData.description || undefined,
                specifications: formData.specifications ? formData.specifications.split('\n').filter((s) => s.trim()) : [],
                stock: parseInt(formData.stock),
                isNewArrival: formData.isNewArrival,
                isBestSeller: formData.isBestSeller,
                isTrending: formData.isTrending,
            };

            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                showToast('Product created successfully!', 'success');
                router.push('/admin/products');
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to create product', 'error');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            showToast('Failed to create product', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="admin-header">
                <h2>Add New Product</h2>
            </header>
            <div className="admin-content">
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>Product Information</h3>
                    </div>
                    <div style={{ padding: '24px' }}>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="admin-form-input"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="admin-form-select"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        <option value="hijab">Hijab</option>
                                        <option value="abaya">Abaya</option>
                                        <option value="gamis">Gamis</option>
                                        <option value="khimar">Khimar</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="admin-form-input"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Original Price (for discount)</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        className="admin-form-input"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Image URL *</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="admin-form-input"
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Colors (comma separated)</label>
                                    <input
                                        type="text"
                                        name="colors"
                                        value={formData.colors}
                                        onChange={handleChange}
                                        className="admin-form-input"
                                        placeholder="Black, White, Navy"
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Sizes (comma separated)</label>
                                    <input
                                        type="text"
                                        name="sizes"
                                        value={formData.sizes}
                                        onChange={handleChange}
                                        className="admin-form-input"
                                        placeholder="S, M, L, XL"
                                    />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Material</label>
                                    <input
                                        type="text"
                                        name="material"
                                        value={formData.material}
                                        onChange={handleChange}
                                        className="admin-form-input"
                                        placeholder="Premium Cotton"
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="admin-form-input"
                                        placeholder="100"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="admin-form-textarea"
                                    placeholder="Product description..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Specifications (one per line)</label>
                                <textarea
                                    name="specifications"
                                    value={formData.specifications}
                                    onChange={handleChange}
                                    className="admin-form-textarea"
                                    placeholder="Premium quality fabric&#10;Machine washable&#10;Free size"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                <label className="admin-form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="isNewArrival"
                                        checked={formData.isNewArrival}
                                        onChange={handleChange}
                                    />
                                    Mark as New Arrival
                                </label>
                                <label className="admin-form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="isBestSeller"
                                        checked={formData.isBestSeller}
                                        onChange={handleChange}
                                    />
                                    Mark as Best Seller
                                </label>
                                <label className="admin-form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="isTrending"
                                        checked={formData.isTrending}
                                        onChange={handleChange}
                                    />
                                    Mark as Trending
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => router.push('/admin/products')}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
