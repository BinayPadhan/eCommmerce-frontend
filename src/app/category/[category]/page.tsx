import ProductListClient from '@/components/ProductListClient';
import { fetchDataFromApi } from '../../../../utils/api';
import CategoryBanner from '@/components/CategoryBanner';

export async function generateStaticParams() {
  const res = await fetchDataFromApi('/api/categories?populate=*');
  return res.data.map((cat: any) => ({
    category: cat.slug,
  }));
}

export default async function ProductListPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const res = await fetchDataFromApi(`/api/products?populate=*&filters[categories][slug][$eq]=${category}`);
  const products = res.data || [];

  return (
    <div>
      <CategoryBanner />
      <ProductListClient category={category} products={products} />
    </div>
  );
}
