import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  icon?: string;
}

export default function CategoryCard({ title, icon = '🎯' }: CategoryCardProps) {
  const categorySlug = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link href={`/vendors/${categorySlug}`}>
      <div className="card cursor-pointer text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">Browse vendors</p>
      </div>
    </Link>
  );
}
