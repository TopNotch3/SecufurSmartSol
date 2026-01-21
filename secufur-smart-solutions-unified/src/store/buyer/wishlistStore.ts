import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WishlistItem, CompareItem } from '@/types/buyer/user';
import { Product } from '@/types/buyer/product';

interface WishlistState {
  // Wishlist
  wishlistItems: WishlistItem[];
  isWishlistLoading: boolean;
  wishlistError: string | null;

  // Compare
  compareItems: CompareItem[];
  maxCompareItems: number;

  // Wishlist Actions
  addToWishlist: (product: Product, options?: { notifyOnPriceDrop?: boolean; notifyOnBackInStock?: boolean }) => void;
  removeFromWishlist: (productId: string) => void;
  updateWishlistItemNotifications: (
    productId: string,
    notifications: { notifyOnPriceDrop?: boolean; notifyOnBackInStock?: boolean }
  ) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;

  // Compare Actions
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  canAddToCompare: () => boolean;

  // Loading & Error
  setWishlistLoading: (loading: boolean) => void;
  setWishlistError: (error: string | null) => void;

  // Utility
  getWishlistItem: (productId: string) => WishlistItem | undefined;
  getCompareItem: (productId: string) => CompareItem | undefined;
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialState = {
  wishlistItems: [] as WishlistItem[],
  isWishlistLoading: false,
  wishlistError: null as string | null,
  compareItems: [] as CompareItem[],
  maxCompareItems: 4,
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Wishlist Actions
      addToWishlist: (product, options = {}) => {
        const state = get();
        if (state.wishlistItems.some((item) => item.productId === product.id)) {
          return; // Already in wishlist
        }

        const newItem: WishlistItem = {
          id: generateId(),
          userId: '', // Will be set when synced with backend
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
          priceAtAdd: product.price,
          currentPrice: product.price,
          priceDropped: false,
          isInStock: product.stockStatus === 'in_stock',
          notifyOnPriceDrop: options.notifyOnPriceDrop ?? false,
          notifyOnBackInStock: options.notifyOnBackInStock ?? false,
        };

        set({ wishlistItems: [...state.wishlistItems, newItem] });
      },

      removeFromWishlist: (productId) => {
        const state = get();
        set({
          wishlistItems: state.wishlistItems.filter((item) => item.productId !== productId),
        });
      },

      updateWishlistItemNotifications: (productId, notifications) => {
        const state = get();
        set({
          wishlistItems: state.wishlistItems.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  notifyOnPriceDrop: notifications.notifyOnPriceDrop ?? item.notifyOnPriceDrop,
                  notifyOnBackInStock: notifications.notifyOnBackInStock ?? item.notifyOnBackInStock,
                }
              : item
          ),
        });
      },

      clearWishlist: () => set({ wishlistItems: [] }),

      isInWishlist: (productId) => {
        return get().wishlistItems.some((item) => item.productId === productId);
      },

      // Compare Actions
      addToCompare: (product) => {
        const state = get();
        if (state.compareItems.length >= state.maxCompareItems) {
          return false; // Max items reached
        }
        if (state.compareItems.some((item) => item.productId === product.id)) {
          return true; // Already in compare
        }

        const newItem: CompareItem = {
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        };

        set({ compareItems: [...state.compareItems, newItem] });
        return true;
      },

      removeFromCompare: (productId) => {
        const state = get();
        set({
          compareItems: state.compareItems.filter((item) => item.productId !== productId),
        });
      },

      clearCompare: () => set({ compareItems: [] }),

      isInCompare: (productId) => {
        return get().compareItems.some((item) => item.productId === productId);
      },

      canAddToCompare: () => {
        const state = get();
        return state.compareItems.length < state.maxCompareItems;
      },

      // Loading & Error
      setWishlistLoading: (isWishlistLoading) => set({ isWishlistLoading }),
      setWishlistError: (wishlistError) => set({ wishlistError }),

      // Utility
      getWishlistItem: (productId) => {
        return get().wishlistItems.find((item) => item.productId === productId);
      },

      getCompareItem: (productId) => {
        return get().compareItems.find((item) => item.productId === productId);
      },

      reset: () => set(initialState),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wishlistItems: state.wishlistItems,
        compareItems: state.compareItems,
      }),
    }
  )
);

// Selectors
export const selectWishlistItems = (state: WishlistState) => state.wishlistItems;
export const selectWishlistCount = (state: WishlistState) => state.wishlistItems.length;
export const selectCompareItems = (state: WishlistState) => state.compareItems;
export const selectCompareCount = (state: WishlistState) => state.compareItems.length;
