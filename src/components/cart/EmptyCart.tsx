'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Empty Cart Component
 * 
 * Displayed when cart has no items.
 */

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-crust-100 flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-crust-400" />
      </div>
      
      <h3 className="font-display text-lg font-semibold text-crust-900">
        Your cart is empty
      </h3>
      
      <p className="text-sm text-crust-600 mt-2 mb-6">
        Looks like you haven&apos;t added any courses yet.
      </p>

      <Link href="/shop">
        <Button>Browse Courses</Button>
      </Link>
    </div>
  );
}

export default EmptyCart;
