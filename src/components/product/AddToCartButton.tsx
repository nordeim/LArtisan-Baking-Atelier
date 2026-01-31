'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProductWithCategory } from '@/lib/shop';

/**
 * Add to Cart Button Component
 * 
 * Primary CTA with loading, success, and error states.
 * Includes quantity selector.
 */

interface AddToCartButtonProps {
  product: ProductWithCategory;
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [buttonState, setButtonState] = useState<ButtonState>('idle');

  const handleAddToCart = async () => {
    setButtonState('loading');
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // TODO: Implement actual cart logic
    console.log('Adding to cart:', { productId: product.id, quantity });
    
    setButtonState('success');
    
    // Reset after showing success
    setTimeout(() => {
      setButtonState('idle');
    }, 2000);
  };

  const isAvailable = product.isAvailable && product.stockQuantity > 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {isAvailable && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-crust-700">Quantity:</span>
          <div className="flex items-center border border-crust-200 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-crust-50 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-12 text-center font-medium text-crust-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
              className="px-3 py-2 hover:bg-crust-50 transition-colors disabled:opacity-50"
              disabled={quantity >= product.stockQuantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {product.stockQuantity < 10 && (
            <span className="text-sm text-crust-500">
              Only {product.stockQuantity} left
            </span>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!isAvailable || buttonState === 'loading'}
        size="lg"
        className={cn(
          'w-full h-14 text-lg font-semibold relative overflow-hidden transition-all',
          buttonState === 'success' && 'bg-sage-600 hover:bg-sage-700'
        )}
      >
        <AnimatePresence mode="wait">
          {buttonState === 'idle' && (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              {isAvailable ? (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </motion.span>
          )}
          
          {buttonState === 'loading' && (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding...
            </motion.span>
          )}
          
          {buttonState === 'success' && (
            <motion.span
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Added to Cart!
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* Trust Badges */}
      {isAvailable && (
        <div className="flex items-center justify-center gap-6 text-xs text-crust-500 pt-2">
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-sage-600" />
            Secure Checkout
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-sage-600" />
            30-Day Guarantee
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-sage-600" />
            Lifetime Access
          </span>
        </div>
      )}
    </div>
  );
}

export default AddToCartButton;
