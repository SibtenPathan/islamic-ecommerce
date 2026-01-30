'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from './ToastContext';

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        image: string;
        category: string;
    };
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
}

interface CartContextType {
    items: CartItem[];
    total: number;
    cartCount: number;
    loading: boolean;
    addToCart: (productId: string, quantity?: number, selectedColor?: string, selectedSize?: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const { data: session, status } = useSession();
    const { showToast } = useToast();
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const refreshCart = useCallback(async () => {
        if (status !== 'authenticated') {
            setItems([]);
            setTotal(0);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = useCallback(async (
        productId: string,
        quantity = 1,
        selectedColor?: string,
        selectedSize?: string
    ) => {
        if (status !== 'authenticated') {
            showToast('Please login to add items to cart', 'warning');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity, selectedColor, selectedSize }),
            });

            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
                setTotal(data.total || 0);
                showToast('Item added to cart!', 'success');
            } else {
                const error = await res.json();
                showToast(error.error || 'Failed to add to cart', 'error');
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
            showToast('Failed to add to cart', 'error');
        } finally {
            setLoading(false);
        }
    }, [status, showToast]);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        if (status !== 'authenticated') return;

        try {
            setLoading(true);
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });

            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error('Failed to update cart:', error);
        } finally {
            setLoading(false);
        }
    }, [status]);

    const removeFromCart = useCallback(async (productId: string) => {
        if (status !== 'authenticated') return;

        try {
            setLoading(true);
            const res = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });

            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        } finally {
            setLoading(false);
        }
    }, [status]);

    return (
        <CartContext.Provider
            value={{
                items,
                total,
                cartCount,
                loading,
                addToCart,
                updateQuantity,
                removeFromCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
