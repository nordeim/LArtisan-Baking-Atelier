'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

/**
 * Cart Badge Component
 * 
 * Displays cart icon with item count badge.
 * Used in header navigation.
 */

interface CartBadgeProps {
  onClick?: () => void;
  className?: string;
}

export function CartBadge({ onClick, className }: CartBadgeProps) {
  const { totals, isLoading } = useCart();

  // Don't show badge during initial load
  if (isLoading) {
    return (
      <button
        className={cn(
          'relative p-2 text-crust-600 hover:text-crust-900 transition-colors',
          className
        )}
        aria-label="Cart"
      >
        <ShoppingCart className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-2 text-crust-600 hover:text-crust-900 transition-colors',
        className
      )}
      aria-label={`Cart with ${totals.itemCount} items`}
    >
      <ShoppingCart className="w-6 h-6" />
      
      {totals.itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-crust-900 text-xs font-bold text-white ring-2 ring-white">
          {totals.itemCount > 99 ? '99+' : totals.itemCount}
        </span>
      )}
    </button>
  );
}

export default CartBadge;
