import ProductImages from "@/components/ProductImg";
import ProductInfo from "@/components/ProductInfo";
import { fetchDataFromApi } from "../../../../utils/api";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const res = await fetchDataFromApi(`/api/products?fields=slug`);
  const products = res?.data || [];

  return products.map((product: any) => ({
    slug: product.attributes.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const res = await fetchDataFromApi(
    `/api/products?populate=*&filters[slug][$eq]=${params.slug}`
  );

  const product = res?.data?.[0]?.attributes;

  if (!product) {
    notFound(); // 404 if product not found
  }

  return (
    <>
      <p className="text-gray-500 text-sm capitalize mt-24 max-w-7xl mx-auto px-4 py-4">
        <Link href="/">Home</Link>
        {product?.categories?.data?.[0]?.attributes && (
          <>
            {" / "}
            <Link href="/#category">Category</Link>
            {" / "}
            <Link href={`/category/${product.categories.data[0].attributes.slug}`}>
              {product.categories.data[0].attributes.name}
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
