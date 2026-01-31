'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Play, Star, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { ProductWithCategory } from '@/lib/shop';

/**
 * Product Card Component
 * 
 * Displays a product in the shop grid with hover effects,
 * pricing, and key metadata.
 */

interface ProductCardProps {
  product: ProductWithCategory;
  index?: number;
  featured?: boolean;
}

export function ProductCard({ product, index = 0, featured = false }: ProductCardProps) {
  // Calculate discount percentage
  const discountPercent = product.compareAtPrice
    ? Math.round(
        (1 - Number(product.price) / Number(product.compareAtPrice)) * 100
      )
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        {/* Image Container */}
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          <Image
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-crust-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-crust-400 text-crust-950 text-xs font-bold rounded-lg">
                Save {discountPercent}%
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-crust-800 text-xs font-semibold rounded-lg">
              {product.category?.name || 'Course'}
            </span>
          </div>

          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-4 py-2 bg-white text-crust-900 text-sm font-semibold rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              Quick View
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-crust-900 group-hover:text-crust-700 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-sm text-crust-600 line-clamp-2">
            {product.shortDescription || product.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-3 text-xs text-crust-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              6 weeks
            </span>
            <span className="flex items-center gap-1">
              <Play className="w-3.5 h-3.5" />
              24 lessons
            </span>
            <span className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-crust-400 fill-current" />
              4.8
            </span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-crust-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-crust-900">
                {formatPrice(Number(product.price), { decimals: 0 })}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-crust-400 line-through">
                  {formatPrice(Number(product.compareAtPrice), { decimals: 0 })}
                </span>
              )}
            </div>
            
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-crust-100 text-crust-700 text-sm font-medium rounded-lg group-hover:bg-crust-200 transition-colors">
              View
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;
