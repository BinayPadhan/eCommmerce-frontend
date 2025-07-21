"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";
import WishlistItemCard from "./WishListItemCard";


const WishlistGrid: React.FC = () => {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>(
    {}
  );
  const [movingItems, setMovingItems] = useState<Set<string | number>>(
    new Set()
  );
  const { wishlistItems, removeFromWishlist } = useWishlistStore();
  // console.log("wishlistItems", wishlistItems);
  const { addToCart } = useCartStore();
  const { user } = useAuth();

  const moveToCart = async (item: any) => {
    const selectedSize = selectedSizes[item.product.id];
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }

    setMovingItems((prev) => new Set(prev).add(item.product.id));

    try {
      await addToCart({
        product: item.product,
        size: selectedSize,
        quantity: 1,
        oneQuantityPrice: parseFloat(item.product.price),
      }, user?.id);

      // Remove from wishlist after successfully adding to cart
      removeFromWishlist(item.product.id);

      // Clear the selected size for this item
      setSelectedSizes((prev) => {
        const newSizes = { ...prev };
        delete newSizes[item.product.id];
        return newSizes;
      });
      toast.success("Move to cart successfully!");
    } catch (error) {
      toast.error("Failed to move item to cart");
      console.error("Failed to move item to cart:", error);
      alert("Failed to move item to cart. Please try again.");
    } finally {
      setMovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.product.id);
        return newSet;
      });
    }
  };

  const handleSizeChange = (productId: string | number, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleRemoveProduct = (productId: string | number) => {
    try {
      removeFromWishlist(productId);
    } catch (error: any) {
      console.error("Product deletion Failed!!", error.message);
    }
  };

  const isItemMoving = (productId: string | number) => {
    return movingItems.has(productId);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-2">Your wishlist is empty</p>
        <p className="text-gray-500">Start adding items you love!</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:p-4">
      {wishlistItems
        .filter((item) => item.product)
        .map((item) => {
          const availableSizes = Array.isArray(item.product.size.data)
            ? item.product.size.data
                .filter((s: any) => s.enable)
                ?.map((s: any) => s.size) || []
            : [];
          const itemMoving = isItemMoving(item.product.id);

          return (
            <WishlistItemCard
              key={item.product.id}
              item={item}
              availableSizes={availableSizes}
              selectedSize={selectedSizes[item.product.id]}
              onSizeChange={handleSizeChange}
              onRemove={handleRemoveProduct}
              onMoveToCart={moveToCart}
              itemMoving={itemMoving}
            />
          );
        })}
    </div>
  );
};

export default WishlistGrid;
