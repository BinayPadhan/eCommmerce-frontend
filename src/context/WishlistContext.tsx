"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getToken } from "@/utils/authCookies";
import { useAuth } from "./AuthContext";
import {
  addToWishlist as addToWishlistAPI,
  getWishlist,
  updateWishlist,
} from "@/lib/api/wishlist";

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

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { isLoggedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isLoggedIn || !user?.id) return;
      setIsLoading(true);
      const token = getToken();

      if (token) {
        try {
          const res = await getWishlist(user.id, token);
          let wishlistData = res?.data[0];
          if (wishlistData) {
            // console.log("wishlistData", wishlistData);
            setWishlistId(wishlistData.documentId);
            // console.log("documentId", wishlistData.documentId);
            if (wishlistData?.products) {
              const mappedItems = wishlistData.products.map((product: any) => ({
                product: product,
              }));
              setWishlistItems(mappedItems);
            } else {
              setWishlistItems([]);
            }
          } else {
            setWishlistItems([]);
          }
        } catch (err: any) {
          console.error("Wishlist error response data:", err.response?.data);
          console.error("Sent URL is: ", err.config?.url);
        }
      }
      setIsLoading(false);
    };
    fetchWishlist();
  }, [user, isLoggedIn]);

  const addToWishlist = async (item: WishlistItem) => {
    const token = getToken();
    if (!token) return;
    const exists = wishlistItems.find((w) => w.product.id === item.product.id);
    if (!exists) {
      await addToWishlistAPI({
        productId: Number(item.product.id),
        token,
        userId: user.id!,
      });
      setWishlistItems((prev) => [...prev, item]);
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    const token = getToken();
    if (!token || !wishlistId) return;
    
    try {
      // Get current product IDs excluding the one to remove
      const remainingProductIds = wishlistItems
        .filter((item) => item.product.id !== productId)
        .map((item) => Number(item.product.id));
      
      // Update wishlist in API
      // console.log("remainingProductIds", remainingProductIds);
      await updateWishlist(remainingProductIds, wishlistId, token);
      
      // Update local state
      setWishlistItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
