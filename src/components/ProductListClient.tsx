"use client";
import { useState, useEffect } from "react";
import FilterSection from "@/components/FilterSection";
import ProductGrid from "@/components/ProductList";
import FilterSortSection from "./FilterSortSection";
import UnifiedFilterSection from "./UnifiedFilterSection";

export default function ProductListClient({
  category,
  products,
}: {
  category: string;
  products: any[];
}) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    setFilters(newFilters);
    console.log("filters", filters);
  };

  useEffect(() => {
    let filtered = [...products];
    console.log("filtered", filtered);
    Object.entries(filters).forEach(([filterTitle, selected]) => {
      if (selected.length === 0) return;
      if (filterTitle.toLowerCase().includes("size")) {
        filtered = filtered.filter(
          (p) =>
            Array.isArray(p.size?.data) &&
            p.size.data.some(
              (sz: any) => sz.enable && selected.includes(sz.size)
            )
        );
      } else if (filterTitle.toLowerCase().includes("price")) {
        filtered = filtered.filter((p) => {
          return selected.some((range) => {
            const match = range.match(/(\d+)/g);
            if (!match || match.length < 2) return true;
            const min = parseInt(match[0], 10);
            const max = parseInt(match[1], 10);
            const price =
              typeof p.price === "string"
                ? parseInt(p.price.replace(/\D/g, ""), 10)
                : p.price;
            return price >= min && price <= max;
          });
        });
      }
    });
    setFilteredProducts(filtered);
  }, [filters, products]);

  return (
    <div className="flex px-0 md:px-0">
      <UnifiedFilterSection
        category={category}
        onFilterChange={handleFilterChange}
      />
      <div className="w-full md:w-4/5">
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
