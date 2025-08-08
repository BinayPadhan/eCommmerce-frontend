"use client";

import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  slug: string;
  image: Array<{
    url: string;
  }>;
  thumbnail?: {
    url: string;
  };
  categories: Array<{
    name: string;
  }>;
}

interface ProductCardProps {
  product: Product;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  const imageUrl = product.thumbnail?.url || "/image/portrait1.webp";
  const hoverUrl = product.image[1]?.url || "/image/portrait1.webp";

  return (
    <div className="flex-shrink-0 w-[50%] md:w-[25%] p-1 md:p-2">
      <Link href={`/product/${product.slug}`} className="block h-full">
        <div
          className="bg-white rounded-lg shadow p-1 md:p-2 h-full flex flex-col"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="relative w-full aspect-square">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain rounded transition-opacity duration-500 ease-in-out"
              style={{ opacity: isHovered ? 0 : 1 }}
            />
            <img
              src={hoverUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain rounded transition-opacity duration-500 ease-in-out"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
          </div>
          <h3 className="mt-2 font-medium">{product.name}</h3>
          <p className="mt-0 text-gray-500 uppercase text-[12px]">
            {product.categories[0]?.name}
          </p>
          <p className="text-black font-semibold">₹ {product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
