'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * Order Summary Component
 * 
 * Displays cart items and totals in checkout.
 */

export function OrderSummary() {
  const { items, totals, validateStock } = useCart();
  const { valid: stockValid, errors: stockErrors } = validateStock();

  return (
    <div className="bg-crust-50 rounded-2xl p-6">
      <h2 className="font-display text-xl font-semibold text-crust-900 mb-4">
        Order Summary
      </h2>

      {/* Items */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            {/* Image */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/shop/${item.slug}`}
                className="text-sm font-medium text-crust-900 hover:text-crust-700 transition-colors line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="text-xs text-crust-500 mt-0.5">
                Qty: {item.quantity}
              </p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm font-semibold text-crust-900">
                {formatPrice(item.price * item.quantity, { decimals: 0 })}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-crust-500">
                  {formatPrice(item.price, { decimals: 0 })} each
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Stock Warnings */}
      {!stockValid && stockErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800 mb-1">
            Stock Issues:
          </p>
          <ul className="text-sm text-red-700 space-y-0.5">
            {stockErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-crust-600">
          <span>Subtotal ({totals.itemCount} items)</span>
          <span>{formatPrice(totals.subtotal, { decimals: 2 })}</span>
        </div>
        
        <div className="flex justify-between text-crust-600">
          <span>GST (9%)</span>
          <span>{formatPrice(totals.gstAmount, { decimals: 2 })}</span>
        </div>

        <div className="flex justify-between text-crust-600">
          <span>Shipping</span>
          <span className="text-sage-600">Free</span>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between text-lg font-semibold text-crust-900">
          <span>Total</span>
          <span>{formatPrice(totals.total, { decimals: 2 })}</span>
        </div>
      </div>

      {/* GST Note */}
      <p className="text-xs text-crust-500 mt-3">
        Includes 9% GST. All prices in SGD.
      </p>

      {/* Security Note */}
      <div className="mt-4 flex items-center gap-2 text-xs text-crust-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure checkout powered by Stripe
      </div>
    </div>
  );
}

export default OrderSummary;
