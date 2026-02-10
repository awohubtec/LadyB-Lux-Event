'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {isLoading && <p className="text-center">Loading orders...</p>}

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Link href="/" className="btn-primary">
            Browse Vendors
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-gray-600">
                    Event: {order.event.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ₦{order.totalAmount.toLocaleString()}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded text-xs font-semibold ${
                      order.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PAID'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <button className="btn-primary text-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
