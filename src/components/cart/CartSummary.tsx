'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

/**
 * Cart Summary Component
 * 
 * Displays cart totals and checkout button.
 */

export function CartSummary() {
  const { totals, items, validateStock } = useCart();

  const { valid: stockValid } = validateStock();

  return (
    <div className="border-t border-crust-200 pt-4 mt-auto">
      {/* Subtotal */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-crust-600">
          <span>Subtotal</span>
          <span>{formatPrice(totals.subtotal, { decimals: 2 })}</span>
        </div>
        
        {/* GST */}
        <div className="flex justify-between text-crust-600">
          <span>GST (9%)</span>
          <span>{formatPrice(totals.gstAmount, { decimals: 2 })}</span>
        </div>

        <Separator className="my-2" />

        {/* Total */}
        <div className="flex justify-between text-base font-semibold text-crust-900">
          <span>Total</span>
          <span>{formatPrice(totals.total, { decimals: 2 })}</span>
        </div>
      </div>

      {/* GST Note */}
      <p className="text-xs text-crust-500 mt-2">
        Prices include 9% GST. Shipping is free for digital products.
      </p>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button
          size="lg"
          className="w-full mt-4"
          disabled={items.length === 0 || !stockValid}
        >
          Proceed to Checkout
        </Button>
      </Link>

      {/* Continue Shopping */}
      <Link
        href="/shop"
        className="block text-center text-sm text-crust-600 hover:text-crust-900 mt-3 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default CartSummary;
