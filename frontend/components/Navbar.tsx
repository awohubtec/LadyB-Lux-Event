'use client';

import Link from 'next/link';
import { useCart } from '@/store/cart';
import { getAuthUser, clearAuthData } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const { getItemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          🎉 LadyB Lux Events
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/event/create" className="hover:underline">
                Create Event
              </Link>
              {user.role === 'VENDOR' ? (
                <Link href="/dashboard/vendor" className="hover:underline">
                  Dashboard
                </Link>
              ) : (
                <Link href="/dashboard/customer" className="hover:underline">
                  My Orders
                </Link>
              )}
              <Link href="/cart" className="hover:underline relative">
                Cart <span className="ml-1 text-yellow-300">({getItemCount()})</span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary text-sm">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
