'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Hero Section Component
 * 
 * Asymmetric split layout with animated content and floating elements.
 * Features the main value proposition and CTAs.
 */

export function HeroSection() {
  // Animation variants
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay * 0.1,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    }),
  };

  const scaleInVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section
      className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-crust-100/50" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-crust-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-crust-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="max-w-xl">
            {/* Eyebrow Badge */}
            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-crust-100 border border-crust-200 rounded-full text-sm font-medium text-crust-700 mb-6"
            >
              <span className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" />
              Singapore&apos;s Premier Baking Academy
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              id="hero-heading"
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl lg:text-7xl font-semibold text-crust-900 leading-[1.1] tracking-tight mb-6"
            >
              Master the{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Art</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-crust-400/60"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0,8 Q25,0 50,8 T100,8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
              </span>
              <br />
              of Baking
            </motion.h1>

            {/* Subheading */}
            <motion.p
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-lg text-crust-600 leading-relaxed mb-8"
            >
              Learn from world-class master instructors with 20+ years of
              experience. From sourdough artistry to delicate pâtisserie —
              transform your passion into mastery.
            </motion.p>

            {/* Social Proof Stats */}
            <motion.div
              custom={4}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-6 mb-10"
            >
              {/* Avatar Group */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[300, 400, 500, 600].map((shade, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 border-crust-50',
                        `bg-crust-${shade}`
                      )}
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-crust-50 bg-crust-700 flex items-center justify-center text-xs font-semibold text-crust-100">
                    +
                  </div>
                </div>
                <span className="text-sm font-semibold text-crust-800">
                  15,000+ Students
                </span>
              </div>

              <div className="w-px h-5 bg-crust-300 hidden sm:block" />

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-crust-400 fill-current" />
                <span className="text-sm font-semibold text-crust-800">
                  4.9 Rating
                </span>
              </div>

              <div className="w-px h-5 bg-crust-300 hidden sm:block" />

              {/* Completion Rate */}
              <span className="text-sm font-semibold text-crust-800">
                94% Completion
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              custom={5}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-4 text-base font-semibold text-crust-950 bg-crust-400 rounded-2xl hover:bg-crust-500 transition-all shadow-lg hover:shadow-glow"
              >
                Explore Shop
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center gap-2 px-7 py-4 text-base font-semibold text-crust-800 bg-crust-50 border-2 border-crust-300 rounded-2xl hover:border-crust-400 hover:bg-crust-100 transition-all">
                <Play className="w-5 h-5 fill-current" />
                Watch Trailer
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              custom={6}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-4 pt-8 border-t border-crust-200"
            >
              <span className="text-xs uppercase tracking-wider text-crust-500">
                Trusted by
              </span>
              <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="font-display text-sm font-semibold text-crust-600">
                  Le Cordon Bleu
                </span>
                <span className="font-display text-sm font-semibold text-crust-600">
                  Michelin Guide
                </span>
                <span className="font-display text-sm font-semibold text-crust-600">
                  World Pastry Cup
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            variants={scaleInVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Main Hero Image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=1000&fit=crop&q=80"
                alt="Freshly baked artisan sourdough bread with golden crust"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-crust-900/40 via-transparent to-transparent" />

              {/* Floating Certification Card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-panel rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-crust-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-crust-950"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-crust-900">
                        Industry Certified
                      </p>
                      <p className="text-sm text-crust-600">
                        Earn recognized certificates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute -left-8 top-1/4 bg-white rounded-2xl p-5 shadow-elevated hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sage-400/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-sage-500" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-crust-900">
                    50+
                  </p>
                  <p className="text-xs text-crust-600">Countries</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Testimonial Card */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -right-4 bottom-1/4 bg-white rounded-2xl p-4 shadow-elevated max-w-[200px] hidden lg:block"
            >
              <div className="flex items-start gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-crust-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs text-crust-700 leading-relaxed">
                &ldquo;Transformed my baking skills completely!&rdquo;
              </p>
              <p className="mt-1 text-xs font-semibold text-crust-500">
                — Sarah M.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
