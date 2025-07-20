"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';

export default function StoreInitializer() {
  const { isLoggedIn, user } = useAuth();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      // Initialize cart and wishlist stores
      fetchCart(user.id);
      fetchWishlist(user.id);
    }
  }, [isLoggedIn, user?.id, fetchCart, fetchWishlist]);

  return null; // This component doesn't render anything
} 