'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminCategories() {
    const { showToast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        description: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', image: '', description: '', isActive: true });
        setEditingCategory(null);
    };

    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                image: category.image,
                description: category.description || '',
                isActive: category.isActive,
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory._id}`
                : '/api/admin/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                showToast(
                    editingCategory ? 'Category updated successfully!' : 'Category created successfully!',
                    'success'
                );
                closeModal();
                fetchCategories();
            } else {
                const data = await res.json();
                showToast(data.error || 'Operation failed', 'error');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            showToast('Failed to save category', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/admin/categories/${deleteId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Category deleted successfully', 'success');
                fetchCategories();
            } else {
                showToast('Failed to delete category', 'error');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            showToast('Failed to delete category', 'error');
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <>
            <header className="admin-header">
                <h2>Categories</h2>
                <div className="admin-header-actions">
                    <button className="admin-btn admin-btn-primary" onClick={() => openModal()}>
                        + Add Category
                    </button>
                </div>
            </header>
            <div className="admin-content">
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>All Categories ({categories.length})</h3>
                    </div>
                    {loading ? (
                        <div className="admin-loading">Loading categories...</div>
                    ) : categories.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty-icon">🏷️</div>
                            <p>No categories yet. Create your first category.</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Slug</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                                <strong>{category.name}</strong>
                                            </div>
                                        </td>
                                        <td><code>{category.slug}</code></td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {category.description || '-'}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${category.isActive ? 'delivered' : 'cancelled'}`}>
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button
                                                    className="admin-action-btn edit"
                                                    onClick={() => openModal(category)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="admin-action-btn delete"
                                                    onClick={() => setDeleteId(category._id)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                            <button className="admin-modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-modal-body">
                                <div className="admin-form">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Category Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="admin-form-input"
                                            placeholder="e.g., Hijab"
                                            required
                                        />
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
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="admin-form-textarea"
                                            placeholder="Category description..."
                                        />
                                    </div>
                                    <label className="admin-form-checkbox">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                        />
                                        Active
                                    </label>
                                </div>
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {editingCategory ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Delete Category</h3>
                            <button className="admin-modal-close" onClick={() => setDeleteId(null)}>×</button>
                        </div>
                        <div className="admin-modal-body">
                            <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
