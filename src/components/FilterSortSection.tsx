'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, Filter, ChevronRight } from 'lucide-react';
import { filterConfig } from '@/lib/filterConfig';

interface FilterOption {
  title: string;
  options: string[];
}

interface Props {
  category: string;
  onSortChange?: (value: string) => void;
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

const FilterSortSection: React.FC<Props> = ({ category, onSortChange, onFilterChange }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isSortAnimating, setIsSortAnimating] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const filters = filterConfig[category] || [];

  useEffect(() => {
    console.log('Current category:', category);
    console.log('Available filters:', filters);
    // Set the first title as active when filters are loaded
    if (filters.length > 0 && !activeTitle) {
      setActiveTitle(filters[0].title);
    }
  }, [category, filters, activeTitle]);

  const handleFilterChange = (filterTitle: string, option: string) => {
    setSelectedFilters(prev => {
      const currentOptions = prev[filterTitle] || [];
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter(opt => opt !== option)
        : [...currentOptions, option];
      
      const newFilters = {
        ...prev,
        [filterTitle]: newOptions
      };
      
      onFilterChange?.(newFilters);
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
                <button 
                  
                  className="text-sm underline font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filters.length === 0 ? (
                <p className="text-gray-500 p-4">No filters available for category: {category}</p>
              ) : (
                <div className="flex h-full">
                  {/* Left side - Titles */}
                  <div className="w-1/3 border-r">
                    {filters.map((filter, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTitleClick(filter.title)}
                        className={`w-full text-left px-4 py-3 border-b flex items-center justify-between ${
                          activeTitle === filter.title ? 'bg-gray-50 text-black' : 'text-gray-600'
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
                          {filters.find(f => f.title === activeTitle)?.options.map((option, i) => (
                            <label 
                              key={i} 
                              className={`w-full text-left px-4 py-3 border-b flex items-center justify-between ${
                                selectedFilters[activeTitle]?.includes(option) ? 'bg-gray-100 border-gray-400' : 'border-gray-200'
                              }`}
                            >{option}
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedFilters[activeTitle]?.includes(option) || false}
                                onChange={() => handleFilterChange(activeTitle, option)}
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
      {(showSort || isSortAnimating) && (
        <div 
          className={`fixed inset-0 bg-black/50 z-[100] flex items-end md:hidden transition-all duration-300 ease-in-out ${
            showSort ? 'opacity-100' : 'opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Sort options"
        >
          <div className={`w-full h-[35%] bg-white rounded-t-lg transform transition-all duration-300 ease-in-out ${
            showSort ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sort By</h3>
                <button 
                  onClick={handleSortClose}
                  className="text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-0">
              <div className="flex flex-col">
                <label className="w-full text-left px-4 py-3 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <span>Recommended</span>
                  <input
                    type="radio"
                    name="sort"
                    className="w-4 h-4"
                    onChange={() => {
                      onSortChange?.('');
                    }}
                  />
                </label>
                <label className="w-full text-left px-4 py-3 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <span>Price: Low to High</span>
                  <input
                    type="radio"
                    name="sort"
                    className="w-4 h-4"
                    onChange={() => {
                      onSortChange?.('priceLow');
                    }}
                  />
                </label>
                <label className="w-full text-left px-4 py-3 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <span>Price: High to Low</span>
                  <input
                    type="radio"
                    name="sort"
                    className="w-4 h-4"
                    onChange={() => {
                      onSortChange?.('priceHigh');
                    }}
                  />
                </label>
                <label className="w-full text-left px-4 py-3 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <span>Newest First</span>
                  <input
                    type="radio"
                    name="sort"
                    className="w-4 h-4"
                    onChange={() => {
                      onSortChange?.('newest');
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSortSection;
