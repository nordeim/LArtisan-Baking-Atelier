/**
 * Shop Page
 * 
 * Product listing page with filtering, sorting, and pagination.
 * Server component that fetches data based on search params.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getProducts } from '@/lib/shop';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton';
import { CategoryFilter } from '@/components/shop/CategoryFilter';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { Pagination } from '@/components/shop/Pagination';
import { EmptyState } from '@/components/shop/EmptyState';

// ============================================
// Metadata
// ============================================

export const metadata: Metadata = {
  title: 'All Courses | L\'Artisan Baking Atelier',
  description: 'Discover professional baking courses taught by master artisans. From sourdough fundamentals to advanced pastry techniques.',
  openGraph: {
    title: 'All Courses | L\'Artisan Baking Atelier',
    description: 'Discover professional baking courses taught by master artisans.',
    type: 'website',
  },
};

// ============================================
// Types
// ============================================

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
    page?: string;
    search?: string;
  }>;
}

// ============================================
// Main Page Component
// ============================================

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Await search params (Next.js 15+ requirement)
  const params = await searchParams;
  
  // Parse search params
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const sortBy = params.sort || 'newest';
  const category = params.category;
  const search = params.search;

  // Fetch products
  const { products, total, totalPages, categories, currentPage: validPage } = await getProducts({
    category,
    sortBy,
    page: currentPage,
    search,
    limit: 12,
  });

  const hasFilters = !!category || !!search || sortBy !== 'newest';

  return (
    <main className="min-h-screen bg-crust-50">
      {/* Page Header */}
      <div className="bg-white border-b border-crust-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-crust-900">
            All Courses
          </h1>
          <p className="mt-2 text-crust-600">
            {total} professional baking courses to elevate your skills
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <CategoryFilter 
                categories={categories} 
                selectedCategory={category || 'all'} 
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm text-crust-600">
                Showing {products.length} of {total} courses
              </p>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button - TODO */}
                <SortDropdown currentSort={sortBy} />
              </div>
            </div>

            {/* Product Grid or Empty State */}
            {products.length > 0 ? (
              <>
                <Suspense fallback={<ProductGridSkeleton count={12} />}>
                  <ProductGrid products={products} />
                </Suspense>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination 
                      currentPage={validPage} 
                      totalPages={totalPages} 
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState 
                hasFilters={hasFilters} 
                searchQuery={search} 
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
