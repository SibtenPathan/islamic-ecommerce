'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './admin.css';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (status === 'loading') return;

            if (!session) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('/api/admin/dashboard');
                if (res.ok) {
                    setIsAdmin(true);
                } else {
                    router.push('/');
                }
            } catch {
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [session, status, router]);

    if (loading || status === 'loading') {
        return (
            <div className="admin-layout">
                <div className="admin-loading" style={{ flex: 1, minHeight: '100vh' }}>
                    Loading...
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    const navItems = [
        { href: '/admin', icon: '📊', label: 'Dashboard', exact: true },
        { href: '/admin/analytics', icon: '📈', label: 'Analytics' },
        { href: '/admin/products', icon: '📦', label: 'Products' },
        { href: '/admin/categories', icon: '🏷️', label: 'Categories' },
        { href: '/admin/orders', icon: '🛒', label: 'Orders' },
        { href: '/admin/users', icon: '👥', label: 'Users' },
        { href: '/admin/coupons', icon: '🎟️', label: 'Coupons' },
        { href: '/admin/banners', icon: '🖼️', label: 'Banners' },
        { href: '/admin/events', icon: '📅', label: 'Events' },
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h1>
                        <span>Müslüman</span> Admin
                    </h1>
                    <p>Manage your store</p>
                </div>
                <nav className="admin-nav">
                    <div className="admin-nav-section">
                        <div className="admin-nav-title">Menu</div>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`admin-nav-item ${isActive(item.href, item.exact) ? 'active' : ''}`}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="admin-nav-section">
                        <div className="admin-nav-title">Quick Links</div>
                        <Link href="/" className="admin-nav-item">
                            <span>🏠</span>
                            View Store
                        </Link>
                    </div>
                </nav>
            </aside>
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
