import { useCart } from '@/store/cart';
import { CartItem } from '@/store/cart';

interface CartItemProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="card flex justify-between items-start">
      <div className="flex-1">
        <h3 className="font-semibold">{item.productName}</h3>
        <p className="text-sm text-gray-600">{item.vendorName}</p>
        <p className="text-xs text-gray-500 mt-1">Type: {item.productType}</p>

        {item.deliveryDate && (
          <p className="text-xs text-gray-500 mt-1">Delivery: {new Date(item.deliveryDate).toLocaleDateString()}</p>
        )}

        {item.startDate && item.endDate && (
          <p className="text-xs text-gray-500 mt-1">
            Dates: {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="text-right">
        <p className="font-bold text-blue-600">₦{(item.price * item.quantity).toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
            className="btn-secondary text-xs px-2"
          >
            -
          </button>
          <span className="px-3">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="btn-secondary text-xs px-2"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-red-600 text-sm mt-2 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
