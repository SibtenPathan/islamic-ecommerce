'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 10;

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
}

export function useRecentlyViewed() {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecentlyViewed(JSON.parse(stored));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    const addToRecentlyViewed = useCallback((product: Product) => {
        setRecentlyViewed(prev => {
            // Remove if already exists
            const filtered = prev.filter(p => p._id !== product._id);
            // Add to beginning
            const updated = [product, ...filtered].slice(0, MAX_ITEMS);
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setRecentlyViewed([]);
    }, []);

    return {
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
    };
}
