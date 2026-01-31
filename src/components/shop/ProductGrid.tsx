/**
 * Product Grid Component
 * 
 * Responsive grid layout for displaying products.
 * Works with ProductCard components.
 */

import { ProductCard } from './ProductCard';
import type { ProductWithCategory } from '@/lib/shop';

interface ProductGridProps {
  products: ProductWithCategory[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

export default ProductGrid;
