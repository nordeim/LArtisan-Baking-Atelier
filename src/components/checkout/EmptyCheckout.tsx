'use client';

import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Empty Checkout Component
 * 
 * Displayed when user tries to checkout with an empty cart.
 */

export function EmptyCheckout() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-crust-100 flex items-center justify-center mb-6">
        <ShoppingCart className="w-10 h-10 text-crust-400" />
      </div>

      <h1 className="font-display text-2xl font-semibold text-crust-900 mb-2">
        Your cart is empty
      </h1>

      <p className="text-crust-600 max-w-md mb-8">
        You need to add items to your cart before proceeding to checkout.
        Browse our courses to find something you&apos;ll love.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/shop">
          <Button size="lg" className="gap-2">
            Browse Courses
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default EmptyCheckout;
