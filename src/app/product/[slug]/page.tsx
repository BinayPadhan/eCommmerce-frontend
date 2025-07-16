// ✅ app/product/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import ProductImages from "@/components/ProductImg";
import ProductInfo from "@/components/ProductInfo";
import { fetchDataFromApi } from "../../../../utils/api";

// ✅ Define and export the correct prop type for dynamic route
type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

// ✅ Correct type on `generateStaticParams`
export async function generateStaticParams(){
  const res = await fetchDataFromApi(`/api/products?fields=slug`);
  const products = res?.data || [];
  return products
  .filter((product: any) => product?.slug)
  .map((product: any) => ({
    slug: product.slug,
  }));
}

// ✅ Page component with proper type
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const res = await fetchDataFromApi(
    `/api/products?populate=*&filters[slug][$eq]=${slug}`
  );

  const product = res?.data?.[0];

  if (!product) return notFound();

  return (
    <>
      <p className="text-gray-500 text-sm capitalize mt-24 max-w-7xl mx-auto px-4 py-4">
        <Link href="/">Home</Link>
        {product?.categories?.data?.[0]?.attributes && (
          <>
            {" / "}
            <Link href="/#category">Category</Link>
            {" / "}
            <Link
              href={`/category/${product?.categories?.data?.[0]?.attributes?.slug}`}
            >
              {product?.categories?.data?.[0]?.attributes?.name}
            </Link>
          </>
        )}
        {product?.name && (
          <>
            {" / "}
            <span>{product.name}</span>
          </>
        )}
      </p>
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-10">
        <ProductImages product={product} />
        <ProductInfo product={product} />
      </div>
    </>
  );
}
