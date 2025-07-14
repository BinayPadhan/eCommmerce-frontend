import ProductImages from "@/components/ProductImg";
import ProductInfo from "@/components/ProductInfo";
import { fetchDataFromApi } from "../../../../utils/api";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const res = await fetchDataFromApi(
    `/api/products?populate=*&filters[slug][$eq]=${params.slug}`
  );

  const product = res?.data?.[0];

  return (
    <>
      <p className="text-gray-500 text-sm capitalize mt-24 max-w-7xl mx-auto px-4 py-4">
        <Link href="/">Home</Link>
        {product?.categories && product.categories[0] && (
          <>
            {" / "}
            <Link href={`/#category`}>Category</Link>
          </>
        )}
        {product?.categories && product.categories[0] && (
          <>
            {" / "}
            <Link href={`/category/${product.categories[0].slug}`}>{product.categories[0].name}</Link>
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
