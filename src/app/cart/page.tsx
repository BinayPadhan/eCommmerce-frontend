"use client";
import CartItemList from "@/components/CartItemList";
import CartSummary from "@/components/CartSummary";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CartPage = () => {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();

  // useEffect(() => {
  //   if (!authLoading && !isLoggedIn) {
  //     router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
  //     return;
  //   }
  // }, [isLoggedIn, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:w-[80%] mx-auto p-6 flex flex-col md:flex-row gap-6 mt-20">
      <CartItemList />
      <CartSummary />
    </div>
  );
};

export default CartPage;
