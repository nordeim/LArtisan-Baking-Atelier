import { prisma } from '@/lib/prisma';
import { HeroSection } from '@/components/sections/HeroSection';
import { TrustBar } from '@/components/sections/TrustBar';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { FreeGuideCTA } from '@/components/sections/FreeGuideCTA';
import { InstructorsSection } from '@/components/sections/InstructorsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FinalCTA } from '@/components/sections/FinalCTA';
import type { SerializedProduct } from '@/lib/shop';

/**
 * Fetch featured products from database
 */
async function getFeaturedProducts(): Promise<SerializedProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isAvailable: true,
      },
      take: 5,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialize products for client components (convert Decimal to number)
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      gstRate: Number(product.gstRate),
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      images: product.images,
      weight: product.weight ? Number(product.weight) : null,
      isDigital: product.isDigital,
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      categoryId: product.categoryId,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      category: product.category,
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Homepage
 * 
 * Assembles all section components to create the landing page.
 * Fetches featured products from the database.
 */
export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section - Asymmetric layout with CTAs */}
      <HeroSection />

      {/* Trust Bar - Feature highlights */}
      <TrustBar />

      {/* Featured Products - Bento grid with courses */}
      <FeaturedProducts products={products} />

      {/* Free Guide CTA - Email opt-in */}
      <FreeGuideCTA />

      {/* Instructors - Team showcase */}
      <InstructorsSection />

      {/* Testimonials - Student stories */}
      <TestimonialsSection />

      {/* Final CTA - Closing call-to-action */}
      <FinalCTA />
    </>
  );
}
