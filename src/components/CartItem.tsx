import Image from "next/image";
import Link from "next/link";
import { LoaderCircle, X } from "lucide-react";
import React from "react";

interface CartItemProps {
  item: any;
  loadingItems: Set<any>;
  handleUpdate: (item: any, updates: { quantity?: number; size?: string }) => void;
  handleRemove: (item: any) => void;
}

// Helper to get available sizes from product (handle any type)
const getAvailableSizes = (product: any): string[] => {
  return (
    product.size?.data
      ?.filter((s: any) => s && s.enable)
      .map((s: any) => s.size) || []
  );
};

const CartItem: React.FC<CartItemProps> = ({ item, loadingItems, handleUpdate, handleRemove }) => {
  const isItemLoading = item.id ? loadingItems.has(item.id) : false;
  return (
    <div
      className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 mb-6 rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
    >
      {isItemLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20 rounded-lg">
          <LoaderCircle className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      <div
        className="absolute top-2 right-2 z-10 cursor-pointer p-1 rounded-full hover:bg-gray-200 transition"
        onClick={() => handleRemove(item)}
      >
        <X size={20} />
      </div>

      <div className="flex items-center gap-6 w-full sm:w-auto">
        <div className="relative w-32 sm:w-40 aspect-[3/4] bg-gray-50 border border-gray-100 rounded-md overflow-hidden flex-shrink-0">
          <Link href={`/product/${item.product.slug}`}>
            <Image
              src={
                item.product?.thumbnail?.url ||
                "/image/portrait1.webp"
              }
              alt={item.product?.name || "Product image"}
              fill
              className="object-contain rounded-md"
            />
          </Link>
        </div>
        <div className="flex flex-col h-full justify-between min-w-0">
          <Link href={`/product/${item.product.slug}`}>
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {item.product.name}
            </h2>
          </Link>

          <div className="flex items-center gap-2 mb-2 mt-1">
            <span className="text-gray-500 text-sm">Size:</span>
            <select
              value={item.size}
              onChange={(e) =>
                handleUpdate(item, { size: e.target.value })
              }
              disabled={isItemLoading}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            >
              {getAvailableSizes(item.product).map((size: string) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              className="px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition"
              onClick={() =>
                item.quantity > 1 &&
                handleUpdate(item, {
                  quantity: item.quantity - 1,
                })
              }
              disabled={item.quantity <= 1 || isItemLoading}
            >
              -
            </button>
            <span className="font-medium text-gray-800 w-6 text-center">
              {item.quantity}
            </span>
            <button
              className="px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              onClick={() =>
                handleUpdate(item, {
                  quantity: item.quantity + 1,
                })
              }
              disabled={isItemLoading}
            >
              +
            </button>
          </div>

          <p className="font-semibold text-blue-600 mt-2 text-base">
            ₹{item.product.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 