'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@prisma/client';

/**
 * Category Filter Component
 * 
 * Sidebar filter for selecting product categories.
 * Updates URL search params for shareable filters.
 */

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    
    // Reset to page 1 when changing category
    params.delete('page');
    
    router.push(`/shop?${params.toString()}`);
  };

  // Count is calculated server-side, passed as prop if needed
  const allCount = 0; // Placeholder - could be fetched separately

  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm font-semibold text-crust-900 uppercase tracking-wide">
        Categories
      </h3>
      
      <div className="space-y-1">
        {/* All Categories Option */}
        <button
          onClick={() => handleCategoryChange('all')}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
            selectedCategory === 'all' || !selectedCategory
              ? 'bg-crust-100 text-crust-900 font-medium'
              : 'text-crust-600 hover:bg-crust-50 hover:text-crust-900'
          )}
        >
          <span className="flex items-center gap-2">
            {(selectedCategory === 'all' || !selectedCategory) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 rounded-full bg-crust-400 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-crust-950" />
              </motion.div>
            )}
            All Courses
          </span>
          <span className="text-xs text-crust-500">
            {allCount}
          </span>
        </button>

        {/* Individual Categories */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.slug)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
              selectedCategory === category.slug
                ? 'bg-crust-100 text-crust-900 font-medium'
                : 'text-crust-600 hover:bg-crust-50 hover:text-crust-900'
            )}
          >
            <span className="flex items-center gap-2">
              {selectedCategory === category.slug && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 rounded-full bg-crust-400 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-crust-950" />
                </motion.div>
              )}
              {category.name}
            </span>
            {/* <span className="text-xs text-crust-500">{category._count?.products ?? 0}</span> */}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
