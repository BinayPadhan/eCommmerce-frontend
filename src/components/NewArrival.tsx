"use client";

import {  useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  slug: string;
  image: Array<{
    url: string;
  }>
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
          {data.map((item) => {
            const imageUrl = item.thumbnail?.url || "/image/portrait1.webp";
            const hoverUrl = item.image[1]?.url || "/image/portrait1.webp";
            const isHovered = hoveredProduct === item.id;
            
            return (
              <div
                key={item.id}
                className="flex-shrink-0 w-[50%] md:w-[25%] p-2"
              >
                <Link href={`/product/${item.slug}`} className="block h-full ">
                  <div 
                    className="bg-white rounded-lg shadow p-2 h-full flex flex-col"
                    onMouseEnter={() => setHoveredProduct(item.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative w-full aspect-square">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain rounded transition-opacity duration-500 ease-in-out"
                        style={{ opacity: isHovered ? 0 : 1 }}
                      />
                      <img
                        src={hoverUrl}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-contain rounded transition-opacity duration-500 ease-in-out"
                        style={{ opacity: isHovered ? 1 : 0 }}
                      />
                    </div>
                    <h3 className="mt-2 font-medium">{item.name}</h3>
                    <p className="mt-0 text-gray-500 uppercase text-[12px]">{item.categories[0]?.name}</p>
                    <p className="text-black font-semibold">₹ {item.price}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
