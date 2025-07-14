// utils/api/auth.ts
import axios from 'axios';
import { createCart } from './cart';
import { createWishlist } from './wishlist';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Register
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axios.post(`${API_URL}/api/auth/local/register`, {
    username,
    email,
    password,
  });

  const data = res.data;
  const userId = data.user.id;
  const token = data.jwt;

  // ✅ Call the reusable cart creation function and wishlist
  await createCart(userId, token);
  await createWishlist(userId, token);

  return data;
};

// Login
export const loginUser = async (
  identifier: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/local`, {
      identifier,
      password,
    });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.error?.message || "Login failed. Try again.";
    throw new Error(message);
  }
};


// Get Current User
export const getCurrentUser = async (jwt: string) => {
  const res = await axios.get(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return res.data;
};
