import { useState } from 'react';
import { useCart } from '@/store/cart';
import { CartItem } from '@/store/cart';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'FOOD' | 'RENTAL' | 'SERVICE';
    quantity?: number;
    vendor: {
      id: string;
      businessName: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showDates, setShowDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product.type === 'FOOD' && !deliveryDate) {
      alert('Please select a delivery date');
      return;
    }

    if (product.type !== 'FOOD' && (!startDate || !endDate)) {
      alert('Please select start and end dates');
      return;
    }

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      vendorId: product.vendor.id,
      vendorName: product.vendor.businessName,
      productType: product.type,
      startDate: product.type !== 'FOOD' ? startDate : undefined,
      endDate: product.type !== 'FOOD' ? endDate : undefined,
      deliveryDate: product.type === 'FOOD' ? deliveryDate : undefined,
    };

    addItem(cartItem);
    alert('Added to cart!');
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
      <p className="text-gray-500 text-xs mt-1">{'by ' + product.vendor.businessName}</p>

      <div className="flex justify-between items-center mt-4">
        <p className="text-2xl font-bold text-blue-600">₦{product.price.toLocaleString()}</p>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-semibold">
          {product.type}
        </span>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="input mt-2"
        />
      </div>

      {product.type === 'FOOD' && (
        <div className="mt-4">
          <label className="block text-sm font-medium">Delivery Date</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="input mt-2"
          />
        </div>
      )}

      {product.type !== 'FOOD' && (
        <div className="mt-4 space-y-2">
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input mt-2"
            />
          </div>
        </div>
      )}

      <button onClick={handleAddToCart} className="btn-primary w-full mt-4">
        Add to Cart
      </button>
    </div>
  );
}
