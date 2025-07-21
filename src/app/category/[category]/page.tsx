import ProductListClient from "@/components/ProductListClient";
import { fetchDataFromApi } from "../../../../utils/api";
import CategoryBanner from "@/components/CategoryBanner";

export async function generateStaticParams() {
  const res = await fetchDataFromApi("/api/categories?populate=*");
  return res.data.map((cat: any) => ({
    category: cat.slug,
  }));
}

interface ProductListPageProps {
  params: {
    category: string;
  };
}

// Separate async function (not exported) to run data fetching
export default async function ProductListPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  let products = { data: [] };

  try {
    products = await fetchDataFromApi(
      `/api/products?populate=*&filters[categories][slug][$eq]=${category}`
    );
  } catch (error) {
    // Optionally log or handle the error

    products = { data: [] };
  }

  return (
    <div>
      <CategoryBanner />
      <ProductListClient category={category} products={products?.data || []} />
    </div>
  );
}
