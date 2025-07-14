"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { checkout } from "@/lib/api/order";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const CartSummary: React.FC = () => {
  const { cartItems } = useCart();
  const [isToCheckout, setIsToCheckout] = useState(false);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const { token } = useAuth();
//   const { cart, total, clearCart } = useCart();

//   const handlePlaceOrder = () => {
//     alert("Order placed successfully!");
//     clearCart();
//   };

  const handleCheckout = async ()=> {
    setIsToCheckout(true);
    try {
      const data = await checkout(token);

      if (data?.stripeSession?.url) {
        // ✅ Redirect to Stripe Checkout
        window.location.href = data.stripeSession.url;
      } else {
        console.error("Stripe session not found", data);
      }
    } catch (error: any) {
      console.error("Failed to add to checkout:", error.response?.data || error);
    } finally {
      setIsToCheckout(false);
    }
  }

  return (
    <div className="w-full md:w-[320px] p-6 mt-14 rounded-xl h-fit sticky top-20 border border-gray-200 bg-custom-gradient  shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">Order Summary</h2>
      <div className="flex items-center justify-between mb-3">
        <span className="text-base text-gray-600">Total Items:</span>
        <span className="text-base font-medium text-gray-900">{totalQuantity}</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg text-gray-700">Total:</span>
        <span className="text-2xl font-extrabold text-blue-700">₹ {totalPrice}</span>
      </div>
      <button
        onClick={handleCheckout}
        disabled={isToCheckout}
        className="w-full bg-red-500 hover:bg-red-600 focus:ring-2 text-white py-3 rounded-xl font-semibold text-lg shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isToCheckout ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              PLACE ORDER 
            </>
          ) : (
            "PLACE ORDER"
          )}
      </button>
    </div>
  );
};

export default CartSummary;
