/**
 * Product Detail Page
 * 
 * Dynamic route for displaying individual product details.
 * Includes image gallery, course info, curriculum, and reviews.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/shop';
import { ProductHero } from '@/components/product/ProductHero';
import { ProductInfo } from '@/components/product/ProductInfo';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { ProductTabs } from '@/components/product/ProductTabs';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ShareButton } from '@/components/product/ShareButton';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

// ============================================
// Metadata Generation
// ============================================

interface GenerateMetadataProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | L\'Artisan Baking Atelier',
    };
  }

  return {
    title: `${product.name} | L\'Artisan Baking Atelier`,
    description: product.shortDescription || product.description || `Learn ${product.name} with professional bakers`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: product.images.length > 0 && product.images[0] ? [{ url: product.images[0] }] : undefined,
      type: 'article',
    },
  };
}

// ============================================
// Main Page Component
// ============================================

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-crust-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-crust-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/shop">Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Product Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <ProductHero product={product} />

            {/* Right: Product Info */}
            <div className="space-y-6">
              <ProductInfo product={product} />
              
              <Separator />
              
              {/* Add to Cart */}
              <AddToCartButton product={product} />
              
              {/* Share */}
              <div className="flex items-center justify-between pt-4">
                <ShareButton
                  url={`/shop/${product.slug}`}
                  title={product.name}
                  description={product.shortDescription || undefined}
                />
                <p className="text-xs text-crust-500">
                  SKU: {product.sku}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProductTabs product={product} />
        </div>
      </section>

      {/* Related Products */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RelatedProducts 
            productId={product.id} 
            categoryId={product.categoryId} 
          />
        </div>
      </section>
    </main>
  );
}
