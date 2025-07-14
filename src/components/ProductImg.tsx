"use client";
import { useState } from "react";

type Product = {
  image?: Array<{
    url: string;
  }>;
};

type ProductImagesProps = {
  product?: Product;
};

const ProductImages: React.FC<ProductImagesProps> = ({ product }) => {
  const urls = product?.image?.map((img) => img.url) || [];
  const [selectedImage, setSelectedImage] = useState(urls[0] || "");
  const [isChanging, setIsChanging] = useState(false);

  const handleImageChange = (img: string) => {
    setIsChanging(true);
    setTimeout(() => {
      setSelectedImage(img);
      setIsChanging(false);
    }, 200);
  };

  return (
    <div className="w-full md:w-3/5 md:aspect-[3/4]">
      <div className="flex md:flex-row gap-4">
        <div className="hidden md:flex md:flex-col gap-3 md:w-[20%]">
          {urls.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              className={`w-full aspect-[3/4] object-contain rounded border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedImage === img ? "ring-2 ring-red-500 opacity-100" : "hover:opacity-80"
              }`}
              onClick={() => handleImageChange(img)}
            />
          ))}
        </div>
        <div className="w-full md:w-[75%] relative">
          <img
            src={selectedImage}
            alt="Selected"
            className={`w-full h-fit aspect-[3/4] object-contain border rounded transition-all duration-500 ${
              isChanging ? "opacity-0" : "opacity-100"
            }`}
          />
          <div className="flex md:hidden gap-3 mt-4">
            {urls.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`w-20 aspect-[3/4] object-contain rounded border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedImage === img ? "ring-2 ring-red-500 opacity-100" : "hover:opacity-80"
                }`}
                onClick={() => handleImageChange(img)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
