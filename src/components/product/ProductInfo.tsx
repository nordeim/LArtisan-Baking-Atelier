'use client';

import Link from 'next/link';
import { Star, Clock, Play, Users, Award } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { SerializedProduct } from '@/lib/shop';

/**
 * Product Info Component
 * 
 * Displays product title, price, rating, and key metadata.
 */

interface ProductInfoProps {
  product: SerializedProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const discountPercent = product.compareAtPrice
    ? Math.round(
        (1 - product.price / product.compareAtPrice) * 100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Category Badge */}
      {product.category && (
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="inline-block px-3 py-1 bg-crust-100 text-crust-700 text-xs font-semibold uppercase tracking-wide rounded-full hover:bg-crust-200 transition-colors"
        >
          {product.category.name}
        </Link>
      )}

      {/* Title */}
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-crust-900 leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-5 h-5 text-crust-400 fill-current"
            />
          ))}
        </div>
        <span className="text-sm text-crust-600">
          <span className="font-semibold text-crust-900">4.8</span>
          {' '}(128 reviews)
        </span>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-lg text-crust-600 leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 pt-2">
        <span className="text-4xl font-bold text-crust-900">
          {formatPrice(Number(product.price), { decimals: 0 })}
        </span>
        {product.compareAtPrice && (
          <>
            <span className="text-xl text-crust-400 line-through">
              {formatPrice(Number(product.compareAtPrice), { decimals: 0 })}
            </span>
            <span className="px-2 py-1 bg-crust-400 text-crust-950 text-sm font-bold rounded-lg">
              Save {discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* GST Note */}
      <p className="text-sm text-crust-500">
        Includes 9% GST. One-time payment, lifetime access.
      </p>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-3 p-3 bg-crust-50 rounded-xl">
          <Clock className="w-5 h-5 text-crust-500" />
          <div>
            <p className="text-xs text-crust-500">Duration</p>
            <p className="text-sm font-semibold text-crust-900">6 weeks</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-crust-50 rounded-xl">
          <Play className="w-5 h-5 text-crust-500" />
          <div>
            <p className="text-xs text-crust-500">Lessons</p>
            <p className="text-sm font-semibold text-crust-900">24 videos</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-crust-50 rounded-xl">
          <Users className="w-5 h-5 text-crust-500" />
          <div>
            <p className="text-xs text-crust-500">Students</p>
            <p className="text-sm font-semibold text-crust-900">2,847</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-crust-50 rounded-xl">
          <Award className="w-5 h-5 text-crust-500" />
          <div>
            <p className="text-xs text-crust-500">Certificate</p>
            <p className="text-sm font-semibold text-crust-900">Yes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
