'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data;
    },
  });

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await api.get('/vendors');
      return res.data;
    },
  });

  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
  const completedOrders = orders.filter((o: any) => o.status === 'COMPLETED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card md:text-center">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="card md:text-center">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedOrders}</p>
        </div>
        <div className="card md:text-center">
          <p className="text-gray-600 text-sm">Total Vendors</p>
          <p className="text-3xl font-bold">{vendors.length}</p>
        </div>
        <div className="card md:text-center">
          <p className="text-gray-600 text-sm">Revenue (15%)</p>
          <p className="text-3xl font-bold text-blue-600">
            ₦{Math.round(totalRevenue * 0.15).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'orders'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'vendors'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Vendors ({vendors.length})
          </button>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">All Orders</h2>

          {ordersLoading && <p>Loading...</p>}

          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3">Order ID</th>
                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Event</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Platform Fee (15%)</th>
                    <th className="text-left py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 text-sm">{order.id.slice(0, 8)}</td>
                      <td className="py-3">{order.user.name}</td>
                      <td className="py-3">{order.event.title}</td>
                      <td className="py-3">₦{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            order.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'PAID'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 font-semibold">
                        ₦{Math.round(order.totalAmount * 0.15).toLocaleString()}
                      </td>
                      <td className="py-3 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Vendor Management</h2>

          {vendorsLoading && <p>Loading...</p>}

          {vendors.length === 0 ? (
            <p className="text-gray-500">No vendors yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3">Business Name</th>
                    <th className="text-left py-3">Category</th>
                    <th className="text-left py-3">Location</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Joined</th>
                    <th className="text-left py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor: any) => (
                    <tr key={vendor.id} className="border-b">
                      <td className="py-3 font-semibold">{vendor.businessName}</td>
                      <td className="py-3">{vendor.category}</td>
                      <td className="py-3">{vendor.location}</td>
                      <td className="py-3">
                        {vendor.verified ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-semibold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-sm">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {!vendor.verified && (
                          <button className="btn-primary text-xs">
                            Approve
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
      )}
    </div>
  );
}
