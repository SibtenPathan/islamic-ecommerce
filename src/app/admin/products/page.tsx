'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/contexts/ToastContext';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    stock: number;
    isNewArrival: boolean;
    isBestSeller: boolean;
    isTrending: boolean;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function AdminProducts() {
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [search, category]);

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });
            if (search) params.set('search', search);
            if (category) params.set('category', category);

            const res = await fetch(`/api/admin/products?${params}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/admin/products/${deleteId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Product deleted successfully', 'success');
                fetchProducts(pagination?.page || 1);
            } else {
                showToast('Failed to delete product', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('Failed to delete product', 'error');
        } finally {
            setDeleteId(null);
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
                <h2>Products</h2>
                <div className="admin-header-actions">
                    <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
                        + Add Product
                    </Link>
                </div>
            </header>
            <div className="admin-content">
                {/* Search & Filter */}
                <div className="admin-search">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="admin-search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="admin-filter-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="hijab">Hijab</option>
                        <option value="abaya">Abaya</option>
                        <option value="gamis">Gamis</option>
                        <option value="khimar">Khimar</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>

                {/* Products Table */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>All Products ({pagination?.total || 0})</h3>
                    </div>
                    {loading ? (
                        <div className="admin-loading">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty-icon">📦</div>
                            <p>No products found</p>
                        </div>
                    ) : (
                        <>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Tags</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={48}
                                                        height={48}
                                                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                                                    />
                                                    <span style={{ fontWeight: 500 }}>{product.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                                            <td>{formatCurrency(product.price)}</td>
                                            <td>
                                                <span style={{
                                                    color: product.stock < 10 ? '#dc3545' : '#2d2d2d',
                                                    fontWeight: product.stock < 10 ? 600 : 400
                                                }}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    {product.isNewArrival && (
                                                        <span style={{ fontSize: '10px', background: '#d1ecf1', color: '#0c5460', padding: '2px 6px', borderRadius: '4px' }}>New</span>
                                                    )}
                                                    {product.isBestSeller && (
                                                        <span style={{ fontSize: '10px', background: '#d4edda', color: '#155724', padding: '2px 6px', borderRadius: '4px' }}>Best</span>
                                                    )}
                                                    {product.isTrending && (
                                                        <span style={{ fontSize: '10px', background: '#fff3cd', color: '#856404', padding: '2px 6px', borderRadius: '4px' }}>Trend</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="admin-actions">
                                                    <Link
                                                        href={`/admin/products/${product._id}/edit`}
                                                        className="admin-action-btn edit"
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </Link>
                                                    <button
                                                        className="admin-action-btn delete"
                                                        title="Delete"
                                                        onClick={() => setDeleteId(product._id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
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
                                        onClick={() => fetchProducts(pagination.page - 1)}
                                    >
                                        ←
                                    </button>
                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            className={`admin-pagination-btn ${page === pagination.page ? 'active' : ''}`}
                                            onClick={() => fetchProducts(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        className="admin-pagination-btn"
                                        disabled={pagination.page === pagination.pages}
                                        onClick={() => fetchProducts(pagination.page + 1)}
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Delete Product</h3>
                            <button className="admin-modal-close" onClick={() => setDeleteId(null)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>
                                Cancel
                            </button>
                            <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
