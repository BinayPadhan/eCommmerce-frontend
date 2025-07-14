"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const desktopImages = [
  "/image/landscape1.webp",
  "/image/landscape2.webp",
  "/image/landscape3.webp",
  "/image/landscape4.webp",
];

const mobileImages = [
  "/image/portrait1.webp",
  "/image/portrait2.webp",
  "/image/portrait3.webp",
  "/image/portrait4.webp",
];

const ImageSlider: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle window resize
  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Handle automatic sliding
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentIndex(
          (prev) =>
            (prev + 1) % (isMobile ? mobileImages.length : desktopImages.length)
        );
        setTimeout(() => setIsAnimating(false), 700); 
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, isAnimating]);

  const handleDotClick = (index: number) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 700); 
    }
  };

  const images = isMobile ? mobileImages : desktopImages;

  return (
    <div className="relative w-full mt-20 overflow-hidden">
      <div
        className="relative w-full aspect-[7/9] md:aspect-[384/131] transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute w-full h-full"
            style={{ left: `${index * 100}%` }}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>
      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
