'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SerializedProduct } from '@/lib/shop';

/**
 * Product Hero Component
 * 
 * Image gallery with thumbnail navigation and zoom capability.
 */

interface ProductHeroProps {
  product: SerializedProduct;
}

export function ProductHero({ product }: ProductHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const filteredImages = product.images.filter((img): img is string => typeof img === 'string' && img.length > 0);
  const images: string[] = filteredImages.length > 0 ? filteredImages : ['/images/placeholder.jpg'];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-crust-100 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]!}
              alt={`${product.name} - Image ${currentIndex + 1}`}
              fill
              className={cn(
                'object-cover transition-transform duration-500',
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Indicator */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          <ZoomIn className="w-5 h-5 text-crust-700" />
        </button>

        {/* Navigation Arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-crust-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-crust-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm text-crust-700">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                'relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all',
                currentIndex === index
                  ? 'ring-2 ring-crust-900 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              )}
              aria-label={`Go to image ${index + 1}`}
              aria-current={currentIndex === index ? 'true' : undefined}
            >
              <Image
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductHero;
