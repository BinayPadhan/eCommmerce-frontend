import { create } from 'zustand';
import { getToken } from '@/utils/authCookies';
import {
  getCart,
  addToCart as addToCartAPI,
  updateCartItem as updateCartItemAPI,
  removeCartItem as removeCartItemAPI,
  clearCart as clearCartAPI,
} from '@/lib/api/cart';

interface CartItem {
  id?: number;
  product: {
    id: string | number;
    documentId: string;
    [key: string]: any;
  };
  size: string;
  quantity: number;
  oneQuantityPrice: number;
  totalPrice: number;
}

interface CartStore {
  cartItems: CartItem[];
  isLoading: boolean;
  loadingItems: Set<number>;
  cartId?: number;
  
  // Actions
  setCartItems: (items: CartItem[]) => void;
  fetchCart: (userId: string | number) => Promise<void>;
  addToCart: (item: Omit<CartItem, 'totalPrice' | 'id'>, userId: string | number) => Promise<void>;
  updateCartItem: (args: {
    productId: string | number;
    oldSize: string;
    newSize?: string;
    quantity?: number;
  }, userId: string | number) => Promise<void>;
  removeCartItem: (args: { cartId: number }, userId: string | number) => Promise<void>;
  clearCart: (userId: string | number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setLoadingItem: (itemId: number, loading: boolean) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  isLoading: false,
  loadingItems: new Set(),
  cartId: undefined,

  setCartItems: (items) => set({ cartItems: items }),

  fetchCart: async (userId: string | number) => {
    const token = getToken();
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await getCart(Number(userId), token);
      let cartData = res?.data?.[0];
      
      if (cartData) {
        set({ cartId: cartData.id });
        
        if (cartData?.cart_items) {
          const mappedItems = cartData.cart_items.map((item: any) => ({
            id: item.id,
            product: item.product,
            size: item.size || 'M',
            quantity: item.quantity || 1,
            oneQuantityPrice: item.oneQuantityPrice || 0,
            totalPrice: item.totalPrice || 0,
          }));
          set({ cartItems: mappedItems });
        } else {
          set({ cartItems: [] });
        }
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    }
    set({ isLoading: false });
  },

  addToCart: async (item, userId) => {
    const token = getToken();
    if (!token) return;

    set({ isLoading: true });
    const { cartItems, cartId } = get();

    try {
      // Check if item already exists with same product and size
      const existingItem = cartItems.find(
        (p) => p.product.documentId === item.product.documentId && p.size === item.size
      );

      if (existingItem && existingItem.id) {
        // Update existing item
        const newQuantity = existingItem.quantity + item.quantity;
        await updateCartItemAPI(existingItem.id, token, {
          quantity: newQuantity,
        });

        // Update local state
        set((state) => ({
          cartItems: state.cartItems.map((p) =>
            p.id === existingItem.id
              ? {
                  ...p,
                  quantity: newQuantity,
                  totalPrice: p.oneQuantityPrice * newQuantity,
                }
              : p
          ),
        }));
      } else {
        // Add new item
        const cartRes = await addToCartAPI({
          product: item.product,
          size: item.size,
          quantity: item.quantity,
          oneQuantityPrice: item.oneQuantityPrice,
          cartId: cartId!,
          token,
        });

        const newItem: CartItem = {
          id: cartRes.data.id,
          product: item.product,
          size: item.size,
          quantity: item.quantity,
          oneQuantityPrice: item.oneQuantityPrice,
          totalPrice: item.oneQuantityPrice * item.quantity,
        };

        set((state) => ({
          cartItems: [...state.cartItems, newItem],
        }));
      }
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
    set({ isLoading: false });
  },

  updateCartItem: async ({ productId, oldSize, newSize, quantity }, userId) => {
    const token = getToken();
    if (!token) return;

    const { cartItems } = get();
    const itemToUpdate = cartItems.find(
      (item) => item.product.id === productId && item.size === oldSize
    );

    if (!itemToUpdate || !itemToUpdate.id) {
      console.error('Cart item not found for update');
      return;
    }

    // Set loading state for this specific item
    set((state) => ({
      loadingItems: new Set(state.loadingItems).add(itemToUpdate.id!),
    }));

    try {
      const updates: any = {};
      if (quantity !== undefined) updates.quantity = quantity;
      if (newSize !== undefined) updates.size = newSize;

      await updateCartItemAPI(itemToUpdate.id, token, updates);

      // Update local state
      set((state) => ({
        cartItems: state.cartItems.map((item) => {
          if (item.id === itemToUpdate.id) {
            const updatedQuantity = quantity ?? item.quantity;
            const updatedSize = newSize ?? item.size;
            return {
              ...item,
              size: updatedSize,
              quantity: updatedQuantity,
              totalPrice: item.oneQuantityPrice * updatedQuantity,
            };
          }
          return item;
        }),
      }));
    } catch (err) {
      console.error('Failed to update cart item', err);
    }

    // Clear loading state for this item
    set((state) => {
      const newLoadingItems = new Set(state.loadingItems);
      newLoadingItems.delete(itemToUpdate.id!);
      return { loadingItems: newLoadingItems };
    });
  },

  removeCartItem: async ({ cartId }, userId) => {
    const token = getToken();
    if (!token) return;

    try {
      await removeCartItemAPI(cartId, token);
      
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== cartId),
      }));
    } catch (err) {
      console.error('Failed to remove cart item', err);
    }
  },

  clearCart: async (userId) => {
    const token = getToken();
    if (!token) return;

    const { cartId } = get();
    if (!cartId) return;

    try {
      await clearCartAPI(cartId, token);
      set({ cartItems: [] });
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setLoadingItem: (itemId, loading) => {
    set((state) => {
      const newLoadingItems = new Set(state.loadingItems);
      if (loading) {
        newLoadingItems.add(itemId);
      } else {
        newLoadingItems.delete(itemId);
      }
      return { loadingItems: newLoadingItems };
    });
  },
})); 