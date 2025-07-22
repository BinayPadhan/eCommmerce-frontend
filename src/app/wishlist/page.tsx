"use client";
import WishlistGrid from "@/components/WishList";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishlistPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent("/wishlist")}`);
      return;
    }
  }, [isLoggedIn, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {isLoggedIn && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Your Wishlist</h2>
          <WishlistGrid />
        </>
      )}
    </div>
  );
}
