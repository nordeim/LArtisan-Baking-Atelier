'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Free Guide CTA Section
 * 
 * Email opt-in section with book mockup visual.
 * Dark gradient background with form.
 */

export function FreeGuideCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section
      id="free-guide"
      className="py-20 lg:py-28 bg-gradient-to-br from-crust-800 via-crust-900 to-crust-950 relative overflow-hidden"
      aria-labelledby="guide-heading"
    >
      {/* Decorative dots pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#D4A574 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-crust-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-crust-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Column */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6"
            >
              <Gift className="w-4 h-4 text-crust-400" />
              Free Download
            </motion.div>

            {/* Heading */}
            <motion.h2
              id="guide-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 text-balance mb-5"
            >
              Start Your Sourdough Journey Today
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-crust-300 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Get our comprehensive 32-page guide covering starter creation,
              feeding schedules, troubleshooting tips, and your first loaf
              recipe — completely free.
            </motion.p>

            {/* Feature Checklist */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 text-left max-w-sm mx-auto lg:mx-0 mb-8"
            >
              {[
                'Step-by-step starter cultivation',
                'Common mistakes & how to fix them',
                'Pro tips from our master bakers',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-crust-200">
                  <Check className="w-5 h-5 text-crust-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>

            {/* Email Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto lg:mx-0"
            >
              <label htmlFor="email-guide" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  id="email-guide"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-4 bg-crust-800 border border-crust-700 text-crust-100 placeholder-crust-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-crust-400 focus:border-transparent transition-all"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={cn(
                    'px-6 py-4 font-semibold rounded-xl transition-all shadow-lg whitespace-nowrap flex items-center justify-center gap-2',
                    isSubmitted
                      ? 'bg-sage-400 text-crust-950'
                      : 'bg-crust-400 text-crust-950 hover:bg-crust-300 hover:shadow-glow'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <Check className="w-5 h-5" />
                      Guide Sent!
                    </>
                  ) : (
                    'Get Free Guide'
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-crust-500">
                No spam, ever. Unsubscribe anytime. By signing up, you agree to
                our{' '}
                <a href="/privacy" className="underline hover:text-crust-400">
                  Privacy Policy
                </a>
                .
              </p>
            </motion.form>
          </div>

          {/* Visual Column - Book Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Book mockup */}
              <div className="relative bg-gradient-to-br from-crust-100 to-crust-200 rounded-2xl p-1 shadow-elevated transform lg:rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-crust-50 rounded-xl p-8 lg:p-12">
                  <div className="aspect-[3/4] bg-gradient-to-br from-crust-800 to-crust-900 rounded-lg flex flex-col items-center justify-center p-6 text-center shadow-inner">
                    <div className="w-16 h-16 bg-crust-400/20 rounded-2xl flex items-center justify-center mb-6">
                      <svg
                        className="w-8 h-8 text-crust-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-crust-100 mb-2">
                      The Sourdough Starter Guide
                    </h3>
                    <p className="text-sm text-crust-400 mb-4">
                      by L&apos;Artisan Baking Atelier
                    </p>
                    <span className="inline-block px-4 py-1.5 bg-crust-400/20 text-crust-300 text-xs font-semibold rounded-full">
                      32 Pages • Free PDF
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating FREE badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-6 -right-6 bg-crust-400 text-crust-950 rounded-full p-4 shadow-lg"
              >
                <span className="font-bold text-lg">FREE</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FreeGuideCTA;
