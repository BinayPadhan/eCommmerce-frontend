import FilterSection from './FilterSection';
import FilterSortSection from './FilterSortSection';
import { useEffect, useState } from 'react';

interface UnifiedFilterSectionProps {
  category: string;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onSortChange?: (value: string) => void;
}

const UnifiedFilterSection: React.FC<UnifiedFilterSectionProps> = ({
  category,
  onFilterChange,
  onSortChange,
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Function to check if the viewport is desktop size
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (isDesktop) {
    // Desktop: only render FilterSection
    return <FilterSection category={category} onFilterChange={onFilterChange} />;
  } else {
    // Mobile: only render FilterSortSection
    return <FilterSortSection category={category} onFilterChange={onFilterChange} onSortChange={onSortChange} />;
  }
};

export default UnifiedFilterSection; 