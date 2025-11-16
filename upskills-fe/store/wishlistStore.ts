import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlist: number[];
  toggleWishlist: (courseId: number) => void;
  isWishlisted: (courseId: number) => boolean;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (courseId: number) => {
        const { wishlist } = get();
        const newWishlist = wishlist.includes(courseId)
          ? wishlist.filter((id) => id !== courseId)
          : [...wishlist, courseId];
        set({ wishlist: newWishlist });
      },
      isWishlisted: (courseId: number) => {
        const { wishlist } = get();
        return wishlist.includes(courseId);
      },
    }),
    {
      name: 'upskills-wishlist', // Local storage key
    }
  )
);

export default useWishlistStore;
