'use client';
import { useParams } from "next/navigation";
import { filterConfig } from "@/lib/filterConfig";
import { useState, useEffect } from "react";

interface FilterOption {
  title: string;
  options: string[];
}

interface FilterSectionProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onSortChange?: (value: string) => void;
}

export default function FilterSection({
  onFilterChange,
}: FilterSectionProps) {
  const { category } = useParams();
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const filters = filterConfig[category as string] || [];

  useEffect(() => {
    // Reset filters when category changes
    setSelectedFilters({});
  }, [category]);

  const handleFilterChange = (
    filterTitle: string,
    option: string,
    checked: boolean
  ) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[filterTitle]) {
        newFilters[filterTitle] = [];
      }

      if (checked) {
        newFilters[filterTitle] = [...newFilters[filterTitle], option];
      } else {
        newFilters[filterTitle] = newFilters[filterTitle].filter(
          (item) => item !== option
        );
      }

      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  if (!category || !filters.length) {
    return (
      <div className="p-6">
        <aside className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Filters
            </h2>
            <p className="text-gray-500 italic">
              No filters available for this category.
            </p>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="p-0 relative">
      <div className="bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-5rem)]">
        <div className="p-4 border">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 border-r">
          <div className="space-y-4">
            {filters.map((filter, i) => (
              <div key={i} className="filter-group border-b p-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  {filter.title}
                </h3>
                <ul className="space-y-2">
                  {filter.options.map((option, idx) => (
                    <li key={idx}>
                      <label className="flex items-center space-x-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={
                              selectedFilters[filter.title]?.includes(
                                option
                              ) || false
                            }
                            onChange={(e) =>
                              handleFilterChange(
                                filter.title,
                                option,
                                e.target.checked
                              )
                            }
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-red-500 peer-checked:bg-red-500 transition-all duration-200 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                          {option}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
