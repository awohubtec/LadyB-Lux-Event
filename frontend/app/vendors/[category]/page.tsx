'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import VendorCard from '@/components/VendorCard';

interface VendorsPageProps {
  params: {
    category: string;
  };
}

export default function VendorsPage({ params }: VendorsPageProps) {
  const { data: vendors = [], isLoading, error } = useQuery({
    queryKey: ['vendors', params.category],
    queryFn: async () => {
      const res = await api.get(`/vendors?category=${params.category}`);
      return res.data;
    },
  });

  const categoryTitle = params.category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{categoryTitle}</h1>
      <p className="text-gray-600 mb-8">
        Browse verified vendors in this category
      </p>

      {isLoading && <p className="text-center py-8">Loading vendors...</p>}
      {error && (
        <p className="text-red-600 text-center py-8">
          Failed to load vendors. Please try again.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor: any) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>

      {vendors.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 py-8">
          No vendors found in this category
        </p>
      )}
    </div>
  );
}
