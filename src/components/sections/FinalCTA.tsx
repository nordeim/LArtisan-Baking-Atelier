'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Final CTA Section
 * 
 * Closing call-to-action with dual buttons and trust badges.
 */

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="cta-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Heading */}
          <h2
            id="cta-heading"
            className="font-display text-4xl lg:text-5xl font-semibold text-crust-900 text-balance"
          >
            Ready to Begin Your Baking Journey?
          </h2>

          {/* Description */}
          <p className="mt-5 text-lg text-crust-600 max-w-2xl mx-auto">
            Join 15,000+ students mastering the art of baking. Start with our
            free guide or dive into a full course today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-crust-950 bg-crust-400 rounded-2xl hover:bg-crust-500 transition-all shadow-lg hover:shadow-glow transform hover:scale-[1.02]"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#free-guide"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-crust-800 bg-crust-100 border-2 border-crust-200 rounded-2xl hover:border-crust-300 hover:bg-crust-200 transition-all"
            >
              Get Free Guide
            </Link>
          </div>

          {/* Trust Badges */}
          <p className="mt-8 text-sm text-crust-500">
            30-day money-back guarantee • Lifetime access • Industry-recognized
            certificates
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;
