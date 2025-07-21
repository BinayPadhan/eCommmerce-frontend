"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, Filter, ChevronRight } from "lucide-react";
import { filterConfig } from "@/lib/filterConfig";
import SortModal from "./SortModal";


interface Props {
  category: string;
  onSortChange?: (value: string) => void;
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

const FilterSortSection: React.FC<Props> = ({
  category,
  onSortChange,
  onFilterChange,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isSortAnimating, setIsSortAnimating] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const filters = filterConfig[category as string] || [];

  useEffect(() => {
    // Reset filters when category changes
    setSelectedFilters({});
  }, [category]);

  useEffect(() => {
    onFilterChange?.(selectedFilters);
  }, [selectedFilters, onFilterChange]);

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

      return newFilters;
    });
  };

  const handleTitleClick = (title: string) => {
    setActiveTitle(activeTitle === title ? null : title);
  };

  const handleSortClose = () => {
    setIsSortAnimating(true);
    setTimeout(() => {
      setShowSort(false);
      setIsSortAnimating(false);
    }, 300);
  };

  return (
    <>
      {/* Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-3 z-50 md:hidden">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex flex-col items-center text-sm font-medium"
          aria-label="Toggle filters"
        >
          <Filter size={18} />
          Filter
        </button>

        <button
          onClick={() => setShowSort(true)}
          className="flex flex-col items-center text-sm font-medium"
          aria-label="Open sort options"
        >
          <SlidersHorizontal size={18} />
          Sort
        </button>
      </div>

      {/* Filter Section */}
      {showFilter && (
        <div className="fixed inset-0 bg-white z-[100] md:hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button className="text-sm underline font-medium">Clear</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filters.length === 0 ? (
                <p className="text-gray-500 p-4">
                  No filters available for category: {category}
                </p>
              ) : (
                <div className="flex h-full">
                  {/* Left side - Titles */}
                  <div className="w-1/3 border-r">
                    {filters.map((filter, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTitleClick(filter.title)}
                        className={`w-full text-left px-4 py-3 border-b flex items-center justify-between ${
                          activeTitle === filter.title
                            ? "bg-gray-50 text-black"
                            : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium">{filter.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Right side - Options */}
                  <div className="w-2/3 p-0">
                    {activeTitle ? (
                      <div>
                        <div className="flex flex-col">
                          {filters
                            .find((f) => f.title === activeTitle)
                            ?.options.map((option, i) => (
                              <label
                                key={i}
                                className={`w-full text-left px-4 py-3 border-b flex items-center justify-between ${
                                  selectedFilters[activeTitle]?.includes(option)
                                    ? "bg-gray-100 border-gray-400"
                                    : "border-gray-200"
                                }`}
                              >
                                {option}
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={
                                    selectedFilters[activeTitle]?.includes(
                                      option
                                    ) || false
                                  }
                                  onChange={(e) =>
                                    handleFilterChange(
                                      activeTitle,
                                      option,
                                      e.target.checked
                                    )
                                  }
                                />
                              </label>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        Select a filter category
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex border-t">
              <button
                className="w-full text-xl text-black py-3 border-r"
                onClick={() => setShowFilter(false)}
              >
                Close
              </button>
              <button
                className="w-full text-xl  text-black py-3 "
                onClick={() => setShowFilter(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      <SortModal
        showSort={showSort}
        isSortAnimating={isSortAnimating}
        onClose={handleSortClose}
        onSortChange={onSortChange}
      />
    </>
  );
};

export default FilterSortSection;
