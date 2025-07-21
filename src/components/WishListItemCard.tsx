"use client";
import { X, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface WishlistItemCardProps {
  item: any;
  availableSizes: string[];
  selectedSize: string | undefined;
  onSizeChange: (productId: string | number, size: string) => void;
  onRemove: (productId: string | number) => void;
  onMoveToCart: (item: any) => void;
  itemMoving: boolean;
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({
  item,
  availableSizes,
  selectedSize,
  onSizeChange,
  onRemove,
  onMoveToCart,
  itemMoving,
}) => {
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
          onClick={() => onRemove(item.product.id)}
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
                  onClick={() => onSizeChange(item.product.id, size)}
                  disabled={itemMoving}
                  className={`px-3 py-1 border rounded text-sm transition ${
                    selectedSize === size
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
          onClick={() => onMoveToCart(item)}
          disabled={
            (availableSizes.length > 0 && !selectedSize) || itemMoving
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
};

export default WishlistItemCard; 