'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function VendorDashboard() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/vendor/orders');
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card md:text-center">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="card md:text-center">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-3xl font-bold">
            {orders.filter((o: any) => o.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="card md:text-center">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold">
            {orders.filter((o: any) => o.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="card md:text-center">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            ₦{orders
              .reduce((sum: number, order: any) => sum + order.totalAmount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Orders Requiring Action</h2>

        {isLoading && <p>Loading orders...</p>}

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3">Order ID</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Products</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3">{order.id.slice(0, 8)}</td>
                    <td className="py-3">{order.user.name}</td>
                    <td className="py-3">{order.items.length} items</td>
                    <td className="py-3">₦{order.totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          order.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {order.status === 'PAID' && (
                        <button className="btn-primary text-xs">
                          Mark In Progress
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
