interface VendorCardProps {
  vendor: {
    id: string;
    businessName: string;
    category: string;
    location: string;
    verified: boolean;
    rating?: number;
  };
}

export default function VendorCard({ vendor }: VendorCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{vendor.businessName}</h3>
          <p className="text-gray-600 text-sm">{vendor.category}</p>
          <p className="text-gray-500 text-sm mt-1">📍 {vendor.location}</p>
        </div>
        {vendor.verified && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
            ✓ Verified
          </span>
        )}
      </div>
      {vendor.rating && (
        <p className="text-yellow-500 mt-2">⭐ {vendor.rating.toFixed(1)}/5</p>
      )}
      <button className="btn-primary w-full mt-4 text-sm">
        View Products
      </button>
    </div>
  );
}
