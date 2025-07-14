"use client";
import { X, Heart, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";


const WishlistGrid: React.FC = () => {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>(
    {}
  );
  const [movingItems, setMovingItems] = useState<Set<string | number>>(
    new Set()
  );
  const { wishlistItems, removeFromWishlist } = useWishlist();
  // console.log("wishlistItems", wishlistItems);
  const { addToCart } = useCart();

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
      });

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
            <div
              className="border rounded-lg p-1 lg:p-4 hover:shadow-lg transition-shadow relative bg-white flex flex-col h-full"
              key={item.product.id}
            >
              {itemMoving && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20 rounded-lg">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                </div>
              )}

              <div className="relative mb-4">
                <Link href={`/product/${item.product.slug || "#"}`}>
                  <img
                    src={item.product.thumbnail?.url || "/image/portrait1.webp"}
                    alt={item.product.name || "Product image"}
                    className="w-full h-fit object-contain rounded cursor-pointer "
                  />
                </Link>
                <button
                  onClick={() => handleRemoveProduct(item.product.id)}
                  disabled={itemMoving}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition disabled:opacity-50 hover:scale-110"
                  aria-label="Remove from wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <Link href={`/product/${item.product.slug || "#"}`}>
                    <h3 className="font-semibold text-lg hover:text-red-500 transition line-clamp-2">
                      {item.product.name || "Unnamed Product"}
                    </h3>
                  </Link>
                  <p className="font-bold text-xl text-red-600 mt-2">
                    ₹ {item.product.price || "0"}
                  </p>
                </div>

                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Size:
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {availableSizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() =>
                            handleSizeChange(item.product.id, size)
                          }
                          disabled={itemMoving}
                          className={`px-3 py-1 border rounded text-sm transition ${
                            selectedSizes[item.product.id] === size
                              ? "bg-red-500 text-white border-red-500"
                              : "border-gray-300 hover:border-red-500 hover:bg-red-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Move to Cart Button */}
              <div className="mt-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => moveToCart(item)}
                  disabled={
                    (availableSizes.length > 0 &&
                      !selectedSizes[item.product.id]) ||
                    itemMoving
                  }
                  className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {itemMoving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Moving...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Move to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default WishlistGrid;
