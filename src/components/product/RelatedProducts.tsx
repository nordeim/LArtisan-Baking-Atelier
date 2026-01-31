import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getRelatedProducts } from '@/lib/shop';
import type { SerializedProduct } from '@/lib/shop';

/**
 * Related Products Component
 * 
 * Displays related courses for cross-selling.
 * Server component for data fetching.
 */

interface RelatedProductsProps {
  productId: string;
  categoryId: string | null;
}

export async function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const products = await getRelatedProducts(productId, categoryId, 4);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-crust-200 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-crust-900">
          You Might Also Like
        </h2>
        <Link
          href="/shop"
          className="text-sm font-medium text-crust-700 hover:text-crust-900 flex items-center gap-1 group"
        >
          View all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function RelatedProductCard({ product }: { product: SerializedProduct }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-crust-100 hover:border-crust-200 transition-all hover:shadow-card"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-crust-500 mb-1">
          {product.category?.name || 'Course'}
        </p>
        <h3 className="font-display text-sm font-semibold text-crust-900 line-clamp-2 group-hover:text-crust-700 transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-crust-900">
          {formatPrice(product.price, { decimals: 0 })}
        </p>
      </div>
    </Link>
  );
}

export default RelatedProducts;
