/**
 * Product Grid Skeleton
 * 
 * Loading placeholder for product grid.
 * Displays animated skeleton cards while data loads.
 */

import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridSkeletonProps {
  count?: number;
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[4/3] w-full" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        {/* Meta Skeleton */}
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        {/* Price Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-crust-100">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
