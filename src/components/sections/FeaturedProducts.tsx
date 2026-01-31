'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Play, Star, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { ProductWithCategory } from '@/types/database';

/**
 * Featured Products Section
 * 
 * Bento grid layout showcasing featured products/courses.
 * First product is featured (spans 2x2 on desktop).
 */

interface FeaturedProductsProps {
  products: ProductWithCategory[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const featuredProduct = products[0];
  const otherProducts = products.slice(1, 5);

  return (
    <section
      id="courses"
      className="py-20 lg:py-28"
      aria-labelledby="courses-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <span className="inline-block px-3 py-1 bg-crust-200 text-crust-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
            Our Courses
          </span>
          <h2
            id="courses-heading"
            className="font-display text-4xl lg:text-5xl font-semibold text-crust-900 text-balance"
          >
            Discover Your Baking Journey
          </h2>
          <p className="mt-4 text-lg text-crust-600 leading-relaxed">
            From beginner fundamentals to advanced techniques — curated paths
            designed by master artisans.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Product (Large Card) */}
          {featuredProduct && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-card card-lift hover:shadow-card-hover md:col-span-2 lg:row-span-2"
            >
              <Link href={`/shop/${featuredProduct.slug}`} className="block">
                <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[400px]">
                  <Image
                    src={featuredProduct.images[0] || '/images/placeholder.jpg'}
                    alt={featuredProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-crust-900/80 via-crust-900/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-sage-400 text-crust-950 text-xs font-bold uppercase tracking-wide rounded-lg">
                      Bestseller
                    </span>
                  </div>
                  {featuredProduct.compareAtPrice && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 bg-crust-400 text-crust-950 text-xs font-bold rounded-lg">
                        Save{' '}
                        {Math.round(
                          (1 -
                            Number(featuredProduct.price) /
                              Number(featuredProduct.compareAtPrice)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <span className="inline-block px-2 py-0.5 bg-crust-100/20 text-crust-100 text-xs font-medium rounded mb-3 backdrop-blur-sm">
                      {featuredProduct.category?.name || 'Course'}
                    </span>
                    <h3 className="font-display text-2xl lg:text-3xl font-semibold text-white mb-2">
                      {featuredProduct.name}
                    </h3>
                    <p className="text-crust-200 text-sm mb-4 line-clamp-2 lg:line-clamp-none">
                      {featuredProduct.shortDescription || featuredProduct.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-crust-200 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        6 weeks
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        24 lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-crust-400 fill-current" />
                        4.9 (128)
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">
                          {formatPrice(Number(featuredProduct.price), { decimals: 0 })}
                        </span>
                        {featuredProduct.compareAtPrice && (
                          <span className="text-sm text-crust-400 line-through">
                            {formatPrice(Number(featuredProduct.compareAtPrice), { decimals: 0 })}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 px-4 py-2 bg-crust-400 text-crust-950 text-sm font-semibold rounded-xl group-hover:bg-crust-300 transition-colors">
                        Enroll Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          {/* Other Products */}
          {otherProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-card card-lift hover:shadow-card-hover"
            >
              <Link href={`/shop/${product.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-crust-900/60 to-transparent" />

                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-crust-100 text-crust-800 text-xs font-bold uppercase tracking-wide rounded-lg">
                      {product.category?.name || 'Course'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-crust-900 group-hover:text-crust-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-crust-600 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-4 text-xs text-crust-500">
                    <span>4 weeks</span>
                    <span>•</span>
                    <span>16 lessons</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 text-crust-400 fill-current" />
                      4.8 (96)
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-crust-100">
                    <span className="text-xl font-bold text-crust-900">
                      {formatPrice(Number(product.price), { decimals: 0 })}
                    </span>
                    <span className="px-4 py-2 bg-crust-100 text-crust-700 text-sm font-semibold rounded-xl group-hover:bg-crust-200 transition-colors">
                      View Course
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-crust-700 font-semibold hover:text-crust-900 transition-colors group"
          >
            View All Courses
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
