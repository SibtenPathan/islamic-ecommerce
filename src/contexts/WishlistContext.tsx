'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
}

interface WishlistContextType {
    wishlist: Product[];
    isLoading: boolean;
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch wishlist when user logs in
    useEffect(() => {
        const fetchWishlist = async () => {
            if (session?.user) {
                try {
                    const response = await fetch('/api/wishlist');
                    if (response.ok) {
                        const data = await response.json();
                        setWishlist(data.products || []);
                    }
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            } else {
                // Load from localStorage for guest users
                const savedWishlist = localStorage.getItem('guestWishlist');
                if (savedWishlist) {
                    setWishlist(JSON.parse(savedWishlist));
                }
            }
            setIsLoading(false);
        };

        fetchWishlist();
    }, [session]);

    const addToWishlist = async (product: Product) => {
        if (session?.user) {
            try {
                const response = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product._id }),
                });
                if (response.ok) {
                    setWishlist((prev) => [...prev, product]);
                }
            } catch (error) {
                console.error('Error adding to wishlist:', error);
            }
        } else {
            // Guest user - save to localStorage
            const newWishlist = [...wishlist, product];
            setWishlist(newWishlist);
            localStorage.setItem('guestWishlist', JSON.stringify(newWishlist));
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (session?.user) {
            try {
                const response = await fetch(`/api/wishlist?productId=${productId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setWishlist((prev) => prev.filter((p) => p._id !== productId));
                }
            } catch (error) {
                console.error('Error removing from wishlist:', error);
            }
        } else {
            // Guest user
            const newWishlist = wishlist.filter((p) => p._id !== productId);
            setWishlist(newWishlist);
            localStorage.setItem('guestWishlist', JSON.stringify(newWishlist));
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((p) => p._id === productId);
    };

    const clearWishlist = async () => {
        if (session?.user) {
            try {
                await fetch('/api/wishlist', { method: 'DELETE' });
                setWishlist([]);
            } catch (error) {
                console.error('Error clearing wishlist:', error);
            }
        } else {
            setWishlist([]);
            localStorage.removeItem('guestWishlist');
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                isLoading,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
