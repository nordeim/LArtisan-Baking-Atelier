'use client';

import { useCart } from '@/hooks/useCart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { EmptyCart } from './EmptyCart';

/**
 * Cart Drawer Component
 * 
 * Slide-out drawer displaying cart contents.
 */

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totals, isLoading } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="space-y-2.5 pb-4 border-b border-crust-200">
          <SheetTitle className="font-display text-xl">
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {isLoading
              ? 'Loading...'
              : `${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}`}
          </SheetDescription>
        </SheetHeader>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="divide-y divide-crust-100">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && <CartSummary />}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;
