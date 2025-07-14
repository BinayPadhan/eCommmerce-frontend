import { API_URL, STRAPI_API_TOKEN } from "./url";

// Generic fetcher function
export const fetchDataFromApi = async (endpoint: string): Promise<any> => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 3600 }, // For ISR if using App Router
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
};

export const fetchCategories = async () => {
  const res = await fetchDataFromApi("/api/categories?populate=*");
  return res.data;
};
