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
  const [sortOrder, setSortOrder] = useState<string | null>(null);

  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    setFilters(newFilters);
    console.log("filters", filters);
  };
  
  const handleSortChange = (order: string) => {
    setSortOrder(order);
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
    // Sorting logic
    if (sortOrder === "priceLow") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "priceHigh") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOrder === "newest") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
        const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
        return dateB - dateA;
      });
    }
    setFilteredProducts(filtered);
  }, [filters, products, sortOrder]);

  return (
    <div className="flex px-0 md:px-0">
      <UnifiedFilterSection
        category={category}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <div className="w-full md:w-4/5">
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
