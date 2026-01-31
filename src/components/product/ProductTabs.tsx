'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurriculumAccordion } from './CurriculumAccordion';
import { ReviewSection } from './ReviewSection';
import type { ProductWithCategory } from '@/lib/shop';

/**
 * Product Tabs Component
 * 
 * Tabbed interface for Overview, Curriculum, and Reviews.
 */

interface ProductTabsProps {
  product: ProductWithCategory;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start bg-transparent border-b border-crust-200 rounded-none h-auto p-0 gap-8">
        <TabsTrigger
          value="overview"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-crust-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-crust-600 data-[state=active]:text-crust-900 font-medium"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="curriculum"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-crust-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-crust-600 data-[state=active]:text-crust-900 font-medium"
        >
          Curriculum
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-crust-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-crust-600 data-[state=active]:text-crust-900 font-medium"
        >
          Reviews
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="mt-8">
        <div className="prose prose-crust max-w-none">
          <h3 className="font-display text-2xl font-semibold text-crust-900 mb-4">
            About This Course
          </h3>
          <div className="text-crust-600 leading-relaxed space-y-4">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <>
                <p>
                  Master the art of artisan baking with this comprehensive course designed 
                  for both beginners and intermediate bakers. You&apos;ll learn time-honored 
                  techniques passed down through generations of master bakers.
                </p>
                <h4 className="font-display text-lg font-semibold text-crust-900 mt-6 mb-2">
                  What You&apos;ll Learn
                </h4>
                <ul className="list-disc list-inside space-y-2 text-crust-600">
                  <li>Fundamental bread-making techniques and science</li>
                  <li>Sourdough starter creation and maintenance</li>
                  <li>Proper kneading, folding, and shaping methods</li>
                  <li>Oven management and steam injection techniques</li>
                  <li>Troubleshooting common baking problems</li>
                  <li>Professional scoring patterns for beautiful loaves</li>
                </ul>
                <h4 className="font-display text-lg font-semibold text-crust-900 mt-6 mb-2">
                  Course Includes
                </h4>
                <ul className="list-disc list-inside space-y-2 text-crust-600">
                  <li>6 weeks of structured learning content</li>
                  <li>24 HD video lessons with detailed instruction</li>
                  <li>Downloadable recipe cards and guides</li>
                  <li>Private community access</li>
                  <li>Certificate of completion</li>
                  <li>Lifetime access to course materials</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Curriculum Tab */}
      <TabsContent value="curriculum" className="mt-8">
        <CurriculumAccordion />
      </TabsContent>

      {/* Reviews Tab */}
      <TabsContent value="reviews" className="mt-8">
        <ReviewSection productId={product.id} />
      </TabsContent>
    </Tabs>
  );
}

export default ProductTabs;
