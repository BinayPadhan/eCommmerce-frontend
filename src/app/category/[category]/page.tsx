// app/category/[category]/page.tsx

import FilterSection from "@/components/FilterSection";
import SortDropdown from "@/components/Sorting";
import MobileFilterSortBar from "@/components/FilterSortSection";
import ProductGrid from "@/components/ProductList";
import CategoryBanner from "@/components/CategoryBanner";
import { fetchDataFromApi } from "../../../../utils/api";

export async function generateStaticParams() {
  const res = await fetchDataFromApi("/api/categories?populate=*");

  return res.data.map((cat: any) => ({
    category: cat.slug,
  }));
}

export default async function ProductListPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  let products = { data: [] };

  try {
    products = await fetchDataFromApi(`/api/products?populate=*&filters[categories][slug][$eq]=${category}`);
  } catch (error) {
    // Optionally log or handle the error
    products = { data: [] };
  }

  return (
    <div>
      <CategoryBanner />
      {/* <div className="hidden md:flex justify-end px-4 py-4">
        <SortDropdown onSortChange={() => {}} />
      </div> */}
      <div className="flex px-0 md:px-0">
        <div className="hidden md:block w-1/5 sticky top-20 h-fit">
          <FilterSection />
        </div>

        <div className="w-full md:w-4/5">
        <ProductGrid  products={products?.data || []} />
        </div>

        <MobileFilterSortBar category={category} />
      </div>
    </div>
  );
}
