'use client';

import { useEffect, useState } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
            });
            if (search) params.set('search', search);

            const res = await fetch(`/api/admin/users?${params}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="admin-header">
                <h2>Users</h2>
            </header>
            <div className="admin-content">
                {/* Search */}
                <div className="admin-search">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="admin-search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Users Table */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>All Users ({pagination?.total || 0})</h3>
                    </div>
                    {loading ? (
                        <div className="admin-loading">Loading users...</div>
                    ) : users.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty-icon">👥</div>
                            <p>No users found</p>
                        </div>
                    ) : (
                        <>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td style={{ fontWeight: 500 }}>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || '-'}</td>
                                            <td>
                                                <span className={`status-badge ${user.role === 'admin' ? 'shipped' : 'confirmed'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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
                                        onClick={() => fetchUsers(pagination.page - 1)}
                                    >
                                        ←
                                    </button>
                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            className={`admin-pagination-btn ${page === pagination.page ? 'active' : ''}`}
                                            onClick={() => fetchUsers(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        className="admin-pagination-btn"
                                        disabled={pagination.page === pagination.pages}
                                        onClick={() => fetchUsers(pagination.page + 1)}
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
