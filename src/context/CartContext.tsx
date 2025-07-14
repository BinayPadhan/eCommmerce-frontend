"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/utils/authCookies";
import {
  getCart,
  addToCart as addToCartAPI,
  updateCartItem as updateCartItemAPI,
  removeCartItem as removeCartItemAPI,
  clearCart as clearCartAPI,
} from "@/lib/api/cart";

interface CartItem {
  id?: number; // Cart item ID from backend
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

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "totalPrice" | "id">) => Promise<void>;
  updateCartItem: (args: {
    productId: string | number;
    oldSize: string;
    newSize?: string;
    quantity?: number;
  }) => Promise<void>;
  removeCartItem: (args: {
    cartId: number;
  }) => Promise<void>;
  clearCart: () => Promise<void>;
  setCartItems: (items: CartItem[]) => void;
  isLoading: boolean;
  loadingItems: Set<number>; // Track which items are loading
  cartId?: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItemsState] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [cartId, setCartId] = useState<number | undefined>(undefined);
  const { isLoggedIn, user } = useAuth();

  // Load cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn || !user?.id) return;
      setIsLoading(true);
      const token = getToken();
      if (token) {
        try {
          const res = await getCart(user.id, token);
          // console.log("CartData res in Context", res);
          let cartData = res?.data?.[0];
          // console.log("CartData in Context", cartData);
          if (cartData) {
            setCartId(cartData.id);
            // console.log("if cond", cartData?.cart_items);
            if (cartData?.cart_items) {
              const mappedItems = cartData.cart_items.map((item: any) => ({
                id: item.id,
                product: item.product,
                size: item.size || "M",
                quantity: item.quantity || 1,
                oneQuantityPrice: item.oneQuantityPrice || 0,
                totalPrice: item.totalPrice || 0,
              }));
              setCartItemsState(mappedItems);
              // console.log("setCartItemsState", mappedItems);
            } else {
              setCartItemsState([]);
            }
          }
        } catch (err) {
          console.error("Failed to load cart", err);
        }
      }
      setIsLoading(false);
    };
    fetchCart();
  }, [user, isLoggedIn]);

  const addToCart = async (item: Omit<CartItem, "totalPrice" | "id">) => {
    if (!isLoggedIn || !user?.id) return;
    setIsLoading(true);
    const token = getToken();
    if (!token) return;
    try {
      // Check if item already exists with same product and size
      const existingItem = cartItems.find(
        (p) => p.product.documentId === item.product.documentId && p.size === item.size
      );
      if (existingItem && existingItem.id) {
        // Update existing item
        console.log("exist", existingItem);
        const newQuantity = existingItem.quantity + item.quantity;
        await updateCartItemAPI(existingItem.id, token, {
          quantity: newQuantity,
        });
        // Update local state
        setCartItemsState((prev) =>
          prev.map((p) =>
            p.id === existingItem.id
              ? {
                  ...p,
                  quantity: newQuantity,
                  totalPrice: p.oneQuantityPrice * newQuantity,
                }
              : p
          )
        );
      } else {
        // Add new item
        // console.log("cartId", cartId);
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
        setCartItemsState((prev) => [...prev, newItem]);
      }
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
    setIsLoading(false);
  };

  const updateCartItem = async ({
    productId,
    oldSize,
    newSize,
    quantity,
  }: {
    productId: string | number;
    oldSize: string;
    newSize?: string;
    quantity?: number;
  }) => {
    if (!isLoggedIn || !user?.id) return;

    const token = getToken();
    if (!token) return;

    // Find the item to update first
    const itemToUpdate = cartItems.find(
      (item) => item.product.id === productId && item.size === oldSize
    );

    if (!itemToUpdate || !itemToUpdate.id) {
      console.error("Cart item not found for update");
      return;
    }

    try {
      // Set loading state for this specific item
      setLoadingItems((prev) => new Set(prev).add(itemToUpdate.id!));

      const updates: any = {};
      if (quantity !== undefined) updates.quantity = quantity;
      if (newSize !== undefined) updates.size = newSize;
      // console.log("new", productId, newSize, quantity);
      await updateCartItemAPI(itemToUpdate.id, token, updates);

      // Update local state
      setCartItemsState((prev) =>
        prev.map((item) => {
          // console.log("check", item.id === itemToUpdate.id);
          if (item.id === itemToUpdate!.id) {
            const updatedQuantity = quantity ?? item.quantity;
            const updatedSize = newSize ?? item.size;
            // console.log("size:", updatedSize);
            // console.log("quantity:", updatedQuantity);
            return {
              ...item,
              size: updatedSize,
              quantity: updatedQuantity,
              totalPrice: item.oneQuantityPrice * updatedQuantity,
            };
          }
          return item;
        })
      );
    } catch (err) {
      console.error("Failed to update cart item", err);
    } finally {
      // Clear loading state for this specific item
      if (itemToUpdate?.id) {
        setLoadingItems((prev) => {
          const updated = new Set(prev);
          updated.delete(itemToUpdate.id!);
          return updated;
        });
      }
    }
  };

  const removeCartItem = async ({
    cartId,
  }: {
    cartId: number;
  }) => {
    if (!isLoggedIn || !user?.id) return;

    const token = getToken();
    if (!token) return;

    // Set loading state for this specific item
    setLoadingItems((prev) => new Set(prev).add(cartId));

    try {
      // console.log("RemoveItems Selected", cartId);
      const itemToRemove = cartItems.find(
        (item) => item.id === cartId 
      );
      // console.log("RemoveItems", itemToRemove?.id);
      if (itemToRemove && itemToRemove.id) {
        await removeCartItemAPI(itemToRemove.id, token);

        // Update local state
        setCartItemsState((prev) =>
          prev.filter(
            (item) => !(item.id === cartId)
          )
        );
      }
    } catch (err) {
      console.error("Failed to remove cart item", err);
    } finally {
      // Clear loading state for this specific item
      setLoadingItems((prev) => {
        const updated = new Set(prev);
        updated.delete(cartId);
        return updated;
      });
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn || !user?.id) return;
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      await clearCartAPI(cartId!, token);
      setCartItemsState([]);
      setCartId(undefined);
    } catch (err) {
      console.error("Failed to clear cart", err);
    } finally {
      setIsLoading(false);
    }
  };

  const setCartItems = (items: CartItem[]) => {
    setCartItemsState(items);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        setCartItems,
        isLoading,
        loadingItems,
        cartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
