import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../utils/api';
import { WishlistItem } from '../types/api';

interface WishlistContextType {
    wishlist: number[];
    wishlistItems: WishlistItem[];
    loading: boolean;
    toggleWishlist: (courseId: number) => void;
    isWishlisted: (courseId: number) => boolean;
    refreshWishlist: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType>({
    wishlist: [],
    wishlistItems: [],
    loading: false,
    toggleWishlist: () => {},
    isWishlisted: () => false,
    refreshWishlist: async () => {},
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setWishlistItems([]);
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.get<WishlistItem[]>('/wishlist');
            setWishlistItems(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setWishlistItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const toggleWishlist = useCallback(async (courseId: number) => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            return;
        }

        const isCurrentlyWishlisted = wishlistItems.some(item => item.course.id === courseId);

        try {
            if (isCurrentlyWishlisted) {
                // Remove from wishlist
                await apiClient.delete(`/wishlist/${courseId}`);
                setWishlistItems(prev => prev.filter(item => item.course.id !== courseId));
            } else {
                // Add to wishlist
                const response = await apiClient.post<WishlistItem>('/wishlist', { course_id: courseId });
                setWishlistItems(prev => [...prev, response.data]);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            // Optionally show error toast here
        }
    }, [wishlistItems]);

    const isWishlisted = useCallback((courseId: number) => {
        return wishlistItems.some(item => item.course.id === courseId);
    }, [wishlistItems]);

    const wishlist = useMemo(() => {
        return wishlistItems.map(item => item.course.id);
    }, [wishlistItems]);

    const contextValue = useMemo(() => ({
        wishlist,
        wishlistItems,
        loading,
        toggleWishlist,
        isWishlisted,
        refreshWishlist: fetchWishlist,
    }), [wishlist, wishlistItems, loading, toggleWishlist, isWishlisted, fetchWishlist]);

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    );
};
