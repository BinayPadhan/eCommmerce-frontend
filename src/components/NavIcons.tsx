"use client";

import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Heart, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { isLoggedIn, logout } = useAuth();
  const { wishlistItems } = useWishlistStore();
  const { cartItems } = useCartStore();

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {isLoggedIn ? (
        <span onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <UserRound className="w-6 h-6 transition-all duration-300 hover:scale-110 hover:text-red-600 cursor-pointer" />
        </span>
      ) : (
        <Link href="/login">
          <UserRound className="w-6 h-6 transition-all duration-300 hover:scale-110 hover:text-red-600 cursor-pointer" />
        </Link>
      )}

      {isProfileOpen && isLoggedIn && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/profile">Profile</Link>
          <div className="mt-2 cursor-pointer">
            <div className="mt-2 cursor-pointer" onClick={logout}>
              Logout
            </div>
          </div>
        </div>
      )}
      <Link href="/wishlist">
        <div className="relative cursor-pointer">
          <Heart className="w-6 h-6 transition-all duration-300 hover:scale-110 hover:text-red-600 cursor-pointer" />
          {wishlistItems?.length > 0 && (
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-400 rounded-full text-white text-sm flex items-center justify-center">
              {wishlistItems.length}
            </div>
          )}
        </div>
      </Link>
      <Link href="/cart">
        <div className="relative cursor-pointer">
          <ShoppingCart className="w-6 h-6 transition-all duration-300 hover:scale-110 hover:text-red-600 cursor-pointer" />
          {cartItems?.length > 0 && (
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-400 rounded-full text-white text-sm flex items-center justify-center">
              {cartItems.length}
            </div>
          )}
        </div>
      </Link>
      {/* {isCartOpen && <CartModal />} */}
    </div>
  );
};

export default NavIcons;
