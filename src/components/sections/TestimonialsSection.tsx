'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Testimonials Section
 * 
 * Grid of student testimonial cards with quotes and ratings.
 */

const testimonials = [
  {
    quote:
      'The Sourdough Mastery course completely transformed my understanding of fermentation. My loaves now rival bakery quality, and my family can\'t get enough!',
    author: 'Sarah Mitchell',
    role: 'Home Baker',
    location: 'Melbourne, AU',
    initials: 'SM',
    initialsColor: 'bg-crust-300',
  },
  {
    quote:
      "After taking the Viennoiserie course, I opened my own croissant café. The lamination techniques taught here are professional-grade. Worth every penny.",
    author: 'James Kim',
    role: 'Café Owner',
    location: 'Singapore',
    initials: 'JK',
    initialsColor: 'bg-crust-400',
  },
  {
    quote:
      'The community forum is incredible — I\'ve connected with bakers from 30+ countries. The live Q&A sessions with instructors are a game changer.',
    author: 'Elena Petrova',
    role: 'Pastry Chef',
    location: 'Berlin, DE',
    initials: 'EP',
    initialsColor: 'bg-sage-400',
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-crust-100"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 bg-crust-200 text-crust-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
            Student Stories
          </span>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl lg:text-5xl font-semibold text-crust-900 text-balance"
          >
            Transforming Bakers Worldwide
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-white rounded-3xl p-8 shadow-card"
            >
              {/* Quote decoration */}
              <div
                className="absolute top-0 right-8 text-8xl font-display text-crust-100 leading-none -mt-4 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-crust-400 fill-current"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-crust-700 leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${testimonial.initialsColor} rounded-full flex items-center justify-center`}
                >
                  <span className="text-lg font-semibold text-crust-700">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-crust-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-crust-500">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
