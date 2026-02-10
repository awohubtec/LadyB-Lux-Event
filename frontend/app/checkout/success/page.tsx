'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setAuthData } from '@/lib/auth';
import { useCart } from '@/store/cart';

export default function PaymentSuccess() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const reference = params.get('reference');

        if (reference) {
          // Verify payment with backend
          await api.post('/payments/verify', { reference });
          clearCart();
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard/customer');
          }, 3000);
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        router.push('/');
      }
    };

    handlePaymentSuccess();
  }, [router, clearCart]);

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <div className="card">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. Redirecting to your dashboard...
        </p>
        <div className="animate-spin inline-block">⏳</div>
      </div>
    </div>
  );
}
