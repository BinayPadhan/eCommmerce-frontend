"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

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

interface NewArrivalProps {
  data: Product[];
}

const NewArrival: React.FC<NewArrivalProps> = ({ data }) => {
  // console.log("newArrival", data);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth < 768 ? 2 : 4);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalSlides = Math.ceil(data.length / itemsPerView);

  const handleSlide = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "right" && currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Scroll Buttons */}
      <button
        onClick={() => handleSlide("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-md rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => handleSlide("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-md rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Sliding Product Row */}
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {data.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isHovered={hoveredProduct === item.id}
              onMouseEnter={() => setHoveredProduct(item.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
