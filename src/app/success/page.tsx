"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/context/AuthContext";

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  const { user } = useAuth();

  useEffect(() => {
    const clearCartOnSuccess = async () => {
      if (!user?.id) return;
      try {
        await clearCart(user.id);
        console.log('Cart cleared successfully after payment');
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    };

    clearCartOnSuccess();
  }, [clearCart, user?.id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <CircleCheck size={78} className="text-green-600 mb-4 animate-bounce" />
      <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg text-green-800 mb-6">Thank you for your purchase. Your payment was processed successfully.</p>
      <Link href="/" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Go to Home</Link>
    </div>
  );
} 