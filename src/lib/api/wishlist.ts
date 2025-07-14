import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// ✅ Create a wishlist for a user (only once)
export const createWishlist = async (userId: number, token: string) => {
  const res = await axios.post(
    `${API_URL}/wishlists`,
    {
      data: {
        user: userId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ✅ Get wishlist for a user
export const getWishlist = async (userId: number, token: string) => {
  const res = await axios.get(
    `${API_URL}/wishlists?filters[user][id][$eq]=${userId}&populate[products][populate]=*`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ✅ Add product to wishlist (if exists → update, else → create)
export const addToWishlist = async ({
  productId,
  token,
  userId,
}: {
  productId: number;
  token: string;
  userId: number;
}) => {
  // Step 1: Get existing wishlist
  const res = await getWishlist(userId, token);
  const wishlist = res.data[0];

  if (wishlist) {
    const wishlistId = wishlist.documentId;
    console.log("wishlist", wishlist);
    const currentProductIds = wishlist.products.map(
      (p: any) => p.id
    );

    if (!currentProductIds.includes(productId)) {
      const updatedIds = [...currentProductIds, productId];
      return await updateWishlist(updatedIds, wishlistId, token);
    }
    return wishlist; // Already in wishlist
  } else {
    // Create a new wishlist
    return await axios.post(
      `${API_URL}/wishlists`,
      {
        data: {
          user: userId,
          products: [productId],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};

// ✅ Update wishlist (replace product list)
export const updateWishlist = async (
  productIdsArray: number[],
  wishlistId: string,
  token: string
) => {
  const res = await axios.put(
    `${API_URL}/wishlists/${wishlistId}`,
    {
      data: {
        products: productIdsArray,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ✅ Remove a specific product
export const removeFromWishlist = async (
  wishlistId: string,
  productId: number,
  token: string
) => {
  const currentWishlist = await axios.get(
    `${API_URL}/wishlists/${wishlistId}?populate[products]=*`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const currentProducts = currentWishlist.data.data.attributes.products.data;
  const updatedProductIds = currentProducts
    .map((product: any) => product.id)
    .filter((id: number) => id !== productId);

  return await updateWishlist(updatedProductIds, wishlistId, token);
};

// ✅ Clear all products
export const clearWishlist = async (wishlistId: string, token: string) => {
  return await updateWishlist([], wishlistId, token);
};

// ✅ Check if a product is in the wishlist
export const checkWishlistStatus = async (
  userId: number,
  productId: number,
  token: string
) => {
  try {
    const res = await axios.get(
      `${API_URL}/wishlists?filters[user][id][$eq]=${userId}&filters[products][id][$eq]=${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data.length > 0;
  } catch (error) {
    return false;
  }
};
