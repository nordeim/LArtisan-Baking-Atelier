'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchX, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Product Not Found Page
 * 
 * Displayed when a product slug doesn't exist.
 */

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-crust-50 flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-crust-100 flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-12 h-12 text-crust-400" />
        </div>

        {/* Heading */}
        <h1 className="font-display text-3xl font-semibold text-crust-900 mb-4">
          Course Not Found
        </h1>

        {/* Description */}
        <p className="text-crust-600 mb-8">
          We couldn&apos;t find the course you&apos;re looking for. 
          It may have been removed, renamed, or the URL might be incorrect.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Button>
          </Link>
          <Link href="/shop">
            <Button className="gap-2 w-full sm:w-auto">
              <ShoppingBag className="w-4 h-4" />
              Browse All Courses
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-crust-500">
          Need help finding something?{' '}
          <Link href="/contact" className="text-crust-700 hover:text-crust-900 underline">
            Contact our support team
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
