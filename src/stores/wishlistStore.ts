import { create } from 'zustand';
import { getToken } from '@/utils/authCookies';
import {
  addToWishlist as addToWishlistAPI,
  getWishlist,
  updateWishlist,
} from '@/lib/api/wishlist';

interface Product {
  id: string | number;
  name: string;
  price: string;
  slug: string;
  thumbnail?: {
    url: string;
  };
  categories: Array<{
    name: string;
  }>;
  [key: string]: any;
}

interface WishlistItem {
  product: Product;
}

interface WishlistStore {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  wishlistId?: string;
  
  // Actions
  setWishlistItems: (items: WishlistItem[]) => void;
  fetchWishlist: (userId: string | number) => Promise<void>;
  addToWishlist: (item: WishlistItem, userId: string | number) => Promise<void>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
  clearWishlist: () => void;
  setLoading: (loading: boolean) => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistItems: [],
  isLoading: false,
  wishlistId: undefined,

  setWishlistItems: (items) => set({ wishlistItems: items }),

  fetchWishlist: async (userId) => {
    const token = getToken();
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await getWishlist(Number(userId), token);
      let wishlistData = res?.data[0];
      
      if (wishlistData) {
        set({ wishlistId: wishlistData.documentId });
        
        if (wishlistData?.products) {
          const mappedItems = wishlistData.products.map((product: any) => ({
            product: product,
          }));
          set({ wishlistItems: mappedItems });
        } else {
          set({ wishlistItems: [] });
        }
      } else {
        set({ wishlistItems: [] });
      }
    } catch (err: any) {
      console.error('Wishlist error response data:', err.response?.data);
      console.error('Sent URL is: ', err.config?.url);
    }
    set({ isLoading: false });
  },

  addToWishlist: async (item, userId) => {
    const token = getToken();
    if (!token) return;

    const { wishlistItems } = get();
    const exists = wishlistItems.find((w) => w.product.id === item.product.id);
    
    if (!exists) {
      try {
        await addToWishlistAPI({
          productId: Number(item.product.id),
          token,
          userId: Number(userId),
        });
        
        set((state) => ({
          wishlistItems: [...state.wishlistItems, item],
        }));
      } catch (err) {
        console.error('Failed to add to wishlist', err);
      }
    }
  },

  removeFromWishlist: async (productId) => {
    const token = getToken();
    if (!token) return;

    const { wishlistItems, wishlistId } = get();
    if (!wishlistId) return;
    
    try {
      // Get current product IDs excluding the one to remove
      const remainingProductIds = wishlistItems
        .filter((item) => item.product.id !== productId)
        .map((item) => Number(item.product.id));
      
      // Update wishlist in API
      await updateWishlist(remainingProductIds, wishlistId, token);
      
      // Update local state
      set((state) => ({
        wishlistItems: state.wishlistItems.filter((item) => item.product.id !== productId),
      }));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  },

  clearWishlist: () => {
    set({ wishlistItems: [] });
  },

  setLoading: (loading) => set({ isLoading: loading }),
})); 