const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CheckoutResponse = {
  stripeSession?: {
    url?: string;
  };
  // Add other fields if needed
};

export const checkout = async (token: string | null): Promise<CheckoutResponse> => {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
