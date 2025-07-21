import React from 'react';

interface SortModalProps {
  showSort: boolean;
  isSortAnimating: boolean;
  onClose: () => void;
  onSortChange?: (value: string) => void;
}

const SortModal: React.FC<SortModalProps> = ({
  showSort,
  isSortAnimating,
  onClose,
  onSortChange,
}) => {
  if (!showSort && !isSortAnimating) return null;

  return (
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
              onClick={onClose}
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
  );
};

export default SortModal; 