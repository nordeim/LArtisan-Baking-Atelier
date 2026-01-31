'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Empty State Component
 * 
 * Displayed when no products match the current filters.
 * Provides options to clear filters or browse all products.
 */

interface EmptyStateProps {
  hasFilters?: boolean;
  searchQuery?: string;
}

export function EmptyState({ hasFilters = false, searchQuery }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-crust-100 flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-crust-400" />
      </div>
      
      <h3 className="font-display text-2xl font-semibold text-crust-900 mb-2">
        No courses found
      </h3>
      
      <p className="text-crust-600 max-w-md mb-6">
        {searchQuery ? (
          <>
            We couldn&apos;t find any courses matching &quot;<span className="font-medium text-crust-900">{searchQuery}</span>&quot;.
            <br />
            Try adjusting your search or browse all our courses.
          </>
        ) : hasFilters ? (
          <>
            No courses match your current filters.
            <br />
            Try adjusting your filters to see more results.
          </>
        ) : (
          <>
            We&apos;re currently adding new courses.
            <br />
            Check back soon for more baking adventures!
          </>
        )}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {hasFilters && (
          <Link href="/shop">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Clear all filters
            </Button>
          </Link>
        )}
        
        <Link href="/shop">
          <Button className="gap-2">
            Browse all courses
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default EmptyState;
