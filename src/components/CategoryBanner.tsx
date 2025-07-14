"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const desktopImages = ["/image/landscape5.webp"];
const mobileImages = ["/image/portrait5.webp"];

const CategoryBanner = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  return (
    <div className="relative w-full aspect-[32/25] md:aspect-[160/41] mt-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default CategoryBanner; 