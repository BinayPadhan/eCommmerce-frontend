'use client';
import { useState, useRef, useEffect } from 'react';

const SortDropdown = ({ onSortChange }: { onSortChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'Select Sorting Options', label: 'Select Sorting Option'},
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
   
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (value: string) => {
    setSortOption(value);
    onSortChange(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === sortOption)?.label || 'Select Sorting options';

  return (
    <div className="mb-4 text-sm md:text-base relative" ref={dropdownRef}>
      <div
        className="border border-gray-300 w-[250px] rounded px-4 py-2 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform  ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-0 bg-white border-gray-300 border-t-0 shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
