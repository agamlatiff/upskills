import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

const WISHLIST_KEY = 'upskill-wishlist';

interface WishlistContextType {
    wishlist: number[];
    toggleWishlist: (courseId: number) => void;
    isWishlisted: (courseId: number) => boolean;
}

const getWishlistFromStorage = (): number[] => {
    try {
        const item = window.localStorage.getItem(WISHLIST_KEY);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Error reading wishlist from localStorage", error);
        return [];
    }
};

export const WishlistContext = createContext<WishlistContextType>({
    wishlist: [],
    toggleWishlist: () => {},
    isWishlisted: () => false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<number[]>(getWishlistFromStorage);

    useEffect(() => {
        try {
            window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        } catch (error) {
            console.error("Error writing wishlist to localStorage", error);
        }
    }, [wishlist]);

    const toggleWishlist = useCallback((courseId: number) => {
        setWishlist(prevWishlist =>
            prevWishlist.includes(courseId)
                ? prevWishlist.filter(id => id !== courseId)
                : [...prevWishlist, courseId]
        );
    }, []);

    const isWishlisted = useCallback((courseId: number) => {
        return wishlist.includes(courseId);
    }, [wishlist]);

    const contextValue = useMemo(() => ({
        wishlist,
        toggleWishlist,
        isWishlisted,
    }), [wishlist, toggleWishlist, isWishlisted]);

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    );
};
