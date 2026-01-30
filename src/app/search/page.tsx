'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import SearchBar from '@/components/search/SearchBar';
import './search.css';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    colors?: string[];
}

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="search-page">
            <div className="search-container">
                <div className="search-header">
                    <h1>Search Results</h1>
                    <div className="search-bar-wrapper">
                        <SearchBar placeholder="Search products..." />
                    </div>
                </div>

                {query && (
                    <p className="search-query">
                        {loading ? 'Searching for' : `${products.length} results for`}: <strong>"{query}"</strong>
                    </p>
                )}

                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Searching...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="search-results">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : query ? (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h2>No products found</h2>
                        <p>Try adjusting your search terms or browse our categories</p>
                        <Link href="/products" className="browse-btn">
                            Browse All Products
                        </Link>
                    </div>
                ) : (
                    <div className="empty-search">
                        <h2>Start your search</h2>
                        <p>Enter a search term to find products</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="search-page"><div className="loading-state"><div className="loading-spinner"></div></div></div>}>
            <SearchContent />
        </Suspense>
    );
}
