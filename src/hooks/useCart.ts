/**
 * useCart Hook
 * 
 * Custom hook for accessing cart context.
 * Provides type-safe access to cart state and operations.
 */

import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';

/**
 * Hook to access cart context
 * 
 * @returns Cart context value
 * @throws Error if used outside CartProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { items, addItem, removeItem, totals } = useCart();
 *   
 *   return (
 *     <div>
 *       <p>Cart: {totals.itemCount} items</p>
 *       <button onClick={() => addItem(product)}>Add to Cart</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
      'Make sure your component is wrapped with CartProvider in your layout.'
    );
  }

  return context;
}

export default useCart;
