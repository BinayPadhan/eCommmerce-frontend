// components/CategoriesDropdown.tsx
import Link from 'next/link';

interface Category {
  name: string;
  slug: string;
}

interface CategoriesDropdownProps {
  data: Category[];
  isLoading?: boolean;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 w-52 z-20">
        <div className="px-4 py-2 text-sm text-gray-500">
        </div>
      </div>
    );
  }

  return (
    <div className="absolute flex flex-wrap justify-between top-full left-0 mt-0 bg-white shadow-lg rounded-md py-2 w-60 z-20">
      {data.map((cat: Category) => (
        <Link
          key={cat.name}
          href={`/category/${cat.slug}`}
          className="block px-4 py-2 w-full uppercase text-sm text-gray-700 hover:bg-gray-100 hover:font-semibold"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoriesDropdown;