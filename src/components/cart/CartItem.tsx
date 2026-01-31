'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types/cart';

/**
 * Cart Item Component
 * 
 * Displays a single item in the cart with quantity controls.
 */

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link
        href={`/shop/${item.slug}`}
        className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-crust-100"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/shop/${item.slug}`}
          className="block font-medium text-crust-900 hover:text-crust-700 transition-colors line-clamp-2"
        >
          {item.name}
        </Link>
        
        {item.categoryName && (
          <p className="text-xs text-crust-500 mt-0.5">{item.categoryName}</p>
        )}

        {/* Price */}
        <p className="font-semibold text-crust-900 mt-1">
          {formatPrice(itemTotal, { decimals: 0 })}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-crust-200 rounded-lg">
            <button
              onClick={handleDecrease}
              className="p-1.5 hover:bg-crust-50 transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-1.5 hover:bg-crust-50 transition-colors disabled:opacity-50"
              disabled={item.quantity >= item.stockQuantity || item.quantity >= 10}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-2 text-crust-400 hover:text-red-600 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
