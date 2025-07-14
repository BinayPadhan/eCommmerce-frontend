"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

interface Product {
  id: number;
  name: string;
  price: string;
  slug: string;
  thumbnail?: {
    url: string;
  };
  categories: Array<{
    name: string;
    slug: string;
  }>;
}

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();

  const toggleFavorite = (product: Product) => {
    const isInWishlist = wishlistItems.some((item: any) => item.product.id === product.id);
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ product });
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item: any) => item.product.id === productId);
  };

  // console.log(products);
  // console.log("category", products[0]?.categories[0]?.name);

  return (
    <div className="px-4 py-8">
      <p className="text-gray-500 text-sm capitalize"><Link href="/">Home</Link> / {products[0]?.categories[0]?.name || "All Products"}</p>
      <h2 className="text-2xl font-semibold mb-6 text-left uppercase">
        {products[0]?.categories[0]?.name || "All Products"}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const imageUrl = product.thumbnail?.url || "/image/portrait1.jpg"; 
          return (
            <div key={product.id} className="cursor-pointer">
              <Link href={`/product/${product.slug}`}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-auto object-contain rounded"
                />
              </Link>
              <div className="flex items-center px-2 pt-1 justify-between border-b">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="mt-2 font-semibold text-sm text-gray-600">
                    {product.name}
                  </h3>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(product);
                  }}
                  className="cursor-pointer"
                >
                  <Heart
                    strokeWidth={1}
                    fill={isInWishlist(product.id) ? "red" : "none"}
                    className={`w-5 md:w-6 ${
                      isInWishlist(product.id) ? "text-red-500" : "text-gray-500"
                    }`}
                  />
                </button>
              </div>
              <div className="px-2">
                <h3 className="mt-0 font-thin text-sm text-gray-600">
                  {product.categories[0]?.name}
                </h3>
                <p className="font-bold">₹ {product.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
