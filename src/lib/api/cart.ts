// lib/cart-api.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
//create cart for new user
export const createCart = async (userId: number, token: string) => {
  const res = await axios.post(
    `${API_URL}/api/carts`,
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

// 🔄 Fetch cart for current user
export const getCart = async (userId: number, token: string) => {
  // console.log("User ID:", userId);
  // console.log("Token:", token);
  const res = await axios.get(`${API_URL}/api/carts?filters[user][id][$eq]=${userId}&populate[cart_items][populate][product][populate]=thumbnail`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✏️ Update cart (replace all products)
export const updateCart = async (
  productIdsArray: number[],
  cartId: number,
  token: string
) => {
  const res = await axios.put(
    `${API_URL}/api/carts/${cartId}`,
    {
      data: {
        products: productIdsArray,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ➕ Add a product to cart
// utils/cart.ts
export const addToCart = async ({
  product,
  size,
  quantity,
  oneQuantityPrice,
  cartId,
  token,
}: {
  product: any;
  size: string;
  quantity: number;
  oneQuantityPrice: number;
  cartId: number;
  token: string;
}) => {
  return await axios.post(
    `${API_URL}/api/custom-cart-items`,
    {
      data: {
        product: product.documentId,
        size,
        quantity,
        oneQuantityPrice,
        totalPrice: oneQuantityPrice * quantity,
        cart: cartId
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ✏️ Update existing cart item (quantity, size, price)
export const updateCartItem = async (
  cartItemId: number,
  token: string,
  updates: {
    quantity?: number;
    size?: string;
    oneQuantityPrice?: number;
  }
) => {
  // Calculate new total price if quantity or price changed
  let totalPrice: number | undefined;
  if (
    updates.quantity !== undefined ||
    updates.oneQuantityPrice !== undefined
  ) {
    // console.log("api/custom-cart-items/${cartItemId}", cartItemId);
    // We need to get current item data to calculate total price
    const currentItem = await axios.get(
      `${API_URL}/api/custom-cart-items/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // const currentData = currentItem;
    console.log("CurrentData in apoi", currentItem);
    const newQuantity = updates.quantity ?? currentItem.data.quantity;
    const newPrice = updates.oneQuantityPrice ?? currentItem.data.oneQuantityPrice;
    totalPrice = newQuantity * newPrice;
  }

  const res = await axios.put(
    `${API_URL}/api/custom-cart-items/${cartItemId}`,
    {
      data: {
        ...updates,
        ...(totalPrice !== undefined && { totalPrice }),
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ➖ Remove a product from cart
export const removeCartItem = async (cartItemId: number, token: string) => {
  const res = await axios.delete(`${API_URL}/api/custom-cart-items/${cartItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// 🗑️ Clear all cart items for a user
export const clearCart = async (cartId: number, token: string) => {
  // First get all cart items for this cart
  const cartItems = await axios.get(`${API_URL}/api/custom-cart-items?filters[cart][id][$eq]=${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Delete all cart items
  if (cartItems.data && cartItems.data.length > 0) {
    const deletePromises = cartItems.data.map((item: any) =>
      axios.delete(`${API_URL}/api/custom-cart-items/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    
    await Promise.all(deletePromises);
  }

  return { success: true };
};

// 🔍 Get cart item by product and size
export const getCartItemByProductAndSize = async (
  cartId: number,
  productId: number,
  size: string,
  token: string
) => {
  const res = await axios.get(
    `${API_URL}/api/custom-cart-items?filters[cart][id][$eq]=${cartId}&filters[product][id][$eq]=${productId}&filters[size][$eq]=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
