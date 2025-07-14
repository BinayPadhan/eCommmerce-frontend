import Slider from "@/components/Slider";
import NewArrival from "@/components/NewArrival";
import CategoriesSection from "@/components/Categories";
import Footer from "@/components/Footer";
import { fetchCategories, fetchDataFromApi } from "../../utils/api";

export default async function Home() {
  const categories = await fetchCategories();
  const product = await fetchDataFromApi(`/api/products?populate=*&filters[isNewArrival][$eq]=true`)
  // console.log("New", product.data);


  return (
    <main className="min-h-screen">
      <div className="w-full">
        <Slider />
      </div>

      {/* New Arrival Section */}
      <section className="w-full mt-10 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          NEW ARRIVALS
        </h2>
        <NewArrival data={product.data} />
      </section>

      {/* Categories Section */}
      <section className="w-full mt-12 px-4">
        <CategoriesSection data={categories} />
      </section>
    </main>
  );
}
