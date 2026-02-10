'use client';

import { useCart } from '@/store/cart';
import CartItem from '@/components/CartItem';
import Link from 'next/link';

export default function CartPage() {
  const { items, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="card h-fit sticky top-20">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p className="font-semibold">₦{getTotal().toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Delivery Fee</p>
              <p className="font-semibold">₦0</p>
            </div>
            <div className="flex justify-between border-t pt-4 text-lg">
              <p>Total</p>
              <p className="font-bold text-blue-600">₦{getTotal().toLocaleString()}</p>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary w-full mt-6 block text-center">
            Proceed to Checkout
          </Link>

          <button
            onClick={() => {
              if (confirm('Clear cart?')) clearCart();
            }}
            className="btn-secondary w-full mt-2"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
