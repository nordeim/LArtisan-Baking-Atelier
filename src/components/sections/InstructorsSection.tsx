'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * Instructors Section
 * 
 * Grid of instructor cards with portraits and credentials.
 */

const instructors = [
  {
    name: 'Marie-Claude Dubois',
    title: 'Master Pâtissier • Paris',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&h=650&fit=crop&q=80',
    tags: ['Pâtisserie', 'Chocolate', '25 yrs exp'],
  },
  {
    name: 'Marco Bellini',
    title: 'Bread Artisan • Milan',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=650&fit=crop&q=80',
    tags: ['Sourdough', 'Artisan Bread', '22 yrs exp'],
  },
  {
    name: 'Yuki Tanaka',
    title: 'Viennoiserie Expert • Tokyo',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=500&h=650&fit=crop&q=80',
    tags: ['Viennoiserie', 'Lamination', '18 yrs exp'],
  },
];

export function InstructorsSection() {
  return (
    <section
      id="instructors"
      className="py-20 lg:py-28"
      aria-labelledby="instructors-heading"
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
            Your Mentors
          </span>
          <h2
            id="instructors-heading"
            className="font-display text-4xl lg:text-5xl font-semibold text-crust-900 text-balance"
          >
            Learn From World-Class Artisans
          </h2>
          <p className="mt-4 text-lg text-crust-600">
            Our instructors bring 20+ years of professional experience from
            Michelin-starred kitchens and award-winning bakeries.
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <motion.article
              key={instructor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {/* Portrait */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6">
                <Image
                  src={instructor.image}
                  alt={`${instructor.name} - ${instructor.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-crust-900/70 via-transparent to-transparent" />
                
                {/* Name overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-xl font-semibold text-white">
                    {instructor.name}
                  </h3>
                  <p className="text-crust-300 text-sm mt-1">
                    {instructor.title}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {instructor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-crust-100 text-crust-700 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InstructorsSection;
