"use client";
import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getCart } from "@/lib/api/cart";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Product = {
  id: string | number;
  documentId: string;
  name: string;
  price: string;
  slug: string;
  thumbnail?: {
    url: string;
  };
  categories: Array<{
    name: string;
  }>;
  size: {
    data: {
      size: string;
      enable: boolean;
    }[];
  };
};

type ProductInfoProps = {
  product?: Product;
};

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishL, setIsAddingToWishL] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const router = useRouter();
  const { token, user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!user?.id || !token || cartId) return; // prevent repeated fetch
    const fetchCart = async () => {
      try {
        const cartData = await getCart(user.id, token);
        // console.log('cartData', cartData);
        setCartId(cartData?.[0]?.id);
      } catch (err) {
        console.error("Cart fetch error", err);
      }
    };
    fetchCart();
  }, [user?.id, token, cartId]);
  
  // console.log('cartId', cartId);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to the cart');
      router.push(`/login?redirect=${encodeURIComponent("/")}`);
      return;
    }
    if (!product) {
      setErrorMessage("Product not available");
      return;
    }

    if (!selectedSize) {
      setErrorMessage("Please select a size");
      return;
    }

    setErrorMessage("");
    setIsAddingToCart(true);

    try {
      await addToCart({
        product,
        size: selectedSize,
        quantity: 1,
        oneQuantityPrice: parseFloat(product.price),
      }, user?.id); 
      // console.log("Added to cart successfully!");
      toast.success('Added to cart successfully!')
    } catch (error: any) {
      console.error("Failed to add to cart:", error.response?.data || error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (!product || !user?.id) return;
    setIsAddingToWishL(true);
  
    try {
      if (isInWishlist()) {
        await removeFromWishlist(product.id);
        toast.error("Remove from Wishlist!");
      } else {
        await addToWishlist({ product }, user.id);
        toast.success("Added to Wishlist!");
      }
    } catch (error) {
      toast.error("Something went wrong with the wishlist!");
      console.error(error);
    } finally {
      setIsAddingToWishL(false);
    }
  };

  const isInWishlist = () => {
    if (!product) return false;
    return wishlistItems.some((item: any) => item.product.id === product.id);
  };

  return (
    <div className="w-full md:w-2/5 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-700 font-bold">{product?.name}</h1>
        <p className="text-sm text-gray-500">
          {product?.categories && product.categories.length > 0
            ? product.categories[0].name
            : "No category"}
        </p>
      </div>

      <p className="text-lg font-bold">₹ {product?.price}</p>

      {/* Sizes */}
      {product?.size && (
        <div>
          <label className="block font-semibold mb-1">Size</label>
          <div className="flex gap-3 flex-wrap">
            {product.size.data.map((sizeData) => (
              <button
                key={sizeData.size}
                onClick={() => {
                  if (sizeData.enable) {
                    setSelectedSize(sizeData.size);
                    setErrorMessage("");
                  }
                }}
                className={`px-4 py-2 border rounded ${
                  selectedSize === sizeData.size ? "bg-red-500 text-white" : ""
                } ${
                  !sizeData.enable
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : selectedSize !== sizeData.size
                    ? "hover:bg-gray-50"
                    : ""
                }`}
                disabled={!sizeData.enable || isAddingToCart}
              >
                {sizeData.size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      {/* <div>
        <label className="block font-semibold mb-1">Quantity</label>
        <input
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 w-20 rounded"
        />
      </div> */}
      {/* {!selectedSize && <p>size select first!!</p>} */}
      {errorMessage && (
        <span className="text-red-500 font-thin text-sm mt-4 block">
          {errorMessage}
        </span>
      )}
      <div className="flex gap-4">
        <button
          className="flex-1 bg-red-500 text-white uppercase px-6 py-3 rounded hover:opacity-70 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
        <button
          className="w-1/2 border-2 border-gray-300 text-black uppercase px-6 py-3 rounded hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={toggleWishlist}
          disabled={isAddingToWishL}
        >
          {isAddingToWishL ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Heart
                size={20}
                fill={isInWishlist() ? "red" : "none"}
                className={isInWishlist() ? "text-red-500" : "text-gray-500"}
              />
              {isInWishlist() ? "Added to Wishlist" : "Add to Wishlist"}
            </>
          )}
          
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
