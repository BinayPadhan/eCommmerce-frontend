import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  thumbnail: {
    url: string;
    formats?: {
      small?: {
        url: string;
      };
      thumbnail?: {
        url: string;
      };
    };
  } | null;
}

interface CategoriesSectionProps {
  data: Category[];
}

const fallbackImage = '/image/portrait1.webp'; // Add a fallback image in your public/ folder

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ data }) => {


  return (
    <section id="categories" className="px-2 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">CATEGORIES</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((cat) => {
          const thumbnailUrl =cat.thumbnail?.url
          ||  cat.thumbnail?.formats?.thumbnail?.url 
          || cat.thumbnail?.formats?.small?.url 
          || fallbackImage;


          return (
            <Link href={`/category/${cat.slug}`} key={cat.id}>
              <div
                className="rounded-lg overflow-hidden shadow hover:shadow-md transition h-full relative group aspect-square"
              >
                <Image
                  src={thumbnailUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-all duration-300 group-hover:opacity-50 group-hover:scale-110"
                  priority={false}
                  unoptimized // optional: remove if using allowed domain
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-lg md:text-xl font-semibold text-gray-800 uppercase">{cat.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
