"use client";

import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext"; // for token
import { useCartStore } from "@/stores/cartStore";
import CartItem from "./CartItem";

const CartItemList: React.FC = () => {
  const { cartItems, updateCartItem, removeCartItem, isLoading, loadingItems } =
    useCartStore();

  // console.log("CartItemList from CartContext:", cartItems);
  const { token, user } = useAuth();


  // Update handler, type-safe for possibly undefined id
  const handleUpdate = (
    item: any,
    updates: { quantity?: number; size?: string }
  ) => {
    if (!item?.product?.id || !item.size || !user?.id) return;
    if (updates.quantity !== undefined) {
      updateCartItem?.({
        productId: item.product.id,
        oldSize: item.size,
        quantity: updates.quantity,
      }, user.id);
    } else if (updates.size !== undefined) {
      updateCartItem?.({
        productId: item.product.id,
        oldSize: item.size,
        newSize: updates.size,
      }, user.id);
    }
  };

  // Remove handler, pass correct object shape
  const handleRemove = async (item: any) => {
    if (!token || !item?.product?.id || !item.size || !user?.id) return;
    try {
      await removeCartItem({ cartId: item.id }, user.id);
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cart Items</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        cartItems
          .filter((item) => item.product && item.size)
          .map((item) => {
            if (!item.product || !item.size) return null;
            return (
              <CartItem
                key={item.id || `${item.product.id}-${item.size}`}
                item={item}
                loadingItems={loadingItems}
                handleUpdate={handleUpdate}
                handleRemove={handleRemove}
              />
            );
          })
      )}
    </div>
  );
};

export default CartItemList;
