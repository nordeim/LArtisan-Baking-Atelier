'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Review Section Component
 * 
 * Displays product reviews with ratings, filtering, and helpful voting.
 */

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  isHelpful?: boolean;
  verified: boolean;
}

interface ReviewSectionProps {
  productId: string;
}

// Demo reviews - in production, these would come from the database
const demoReviews: Review[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    rating: 5,
    date: '2026-01-15',
    title: 'Transformed my baking!',
    content: 'This course completely changed how I approach bread making. The instructor explains everything so clearly, and the results speak for themselves. My sourdough has never looked better!',
    helpful: 24,
    verified: true,
  },
  {
    id: '2',
    author: 'Michael Torres',
    rating: 5,
    date: '2026-01-10',
    title: 'Worth every penny',
    content: 'I\'ve taken several online baking courses, and this is by far the best. The production quality is excellent, and the curriculum is well-structured. Highly recommended!',
    helpful: 18,
    verified: true,
  },
  {
    id: '3',
    author: 'Emma Wilson',
    rating: 4,
    date: '2026-01-05',
    title: 'Great for beginners',
    content: 'As someone who was intimidated by sourdough, this course made it accessible. The troubleshooting section was particularly helpful when my starter wasn\'t behaving.',
    helpful: 12,
    verified: true,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 89, percentage: 70 },
  { stars: 4, count: 28, percentage: 22 },
  { stars: 3, count: 8, percentage: 6 },
  { stars: 2, count: 2, percentage: 1.5 },
  { stars: 1, count: 1, percentage: 0.5 },
];

export function ReviewSection({ productId }: ReviewSectionProps) {
  // productId available for future API integration
  void productId;
  
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  const averageRating = 4.8;
  const totalReviews = 128;

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const filteredReviews = filterRating
    ? demoReviews.filter((r) => r.rating === filterRating)
    : demoReviews;

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 p-6 bg-crust-50 rounded-2xl">
        {/* Left: Overall Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-display text-5xl font-bold text-crust-900">
              {averageRating}
            </span>
            <span className="text-crust-500">/ 5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-5 h-5',
                  star <= Math.round(averageRating)
                    ? 'text-crust-400 fill-current'
                    : 'text-crust-200'
                )}
              />
            ))}
          </div>
          <p className="text-sm text-crust-600">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Right: Rating Breakdown */}
        <div className="space-y-2">
          {ratingBreakdown.map((item) => (
            <button
              key={item.stars}
              onClick={() => setFilterRating(filterRating === item.stars ? null : item.stars)}
              className={cn(
                'w-full flex items-center gap-3 text-sm transition-colors',
                filterRating === item.stars && 'text-crust-900 font-medium'
              )}
            >
              <span className="w-8 text-crust-600">{item.stars}★</span>
              <div className="flex-1 h-2 bg-crust-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-crust-400 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-12 text-right text-crust-500">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Indicator */}
      {filterRating && (
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-crust-500" />
          <span className="text-sm text-crust-600">
            Showing {filterRating}-star reviews
          </span>
          <button
            onClick={() => setFilterRating(null)}
            className="text-sm text-crust-700 hover:text-crust-900 underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review, index) => (
          <motion.article
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-crust-100 pb-6 last:border-0"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-crust-200 flex items-center justify-center font-semibold text-crust-700">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-crust-900">{review.author}</p>
                  <p className="text-xs text-crust-500">{review.date}</p>
                </div>
              </div>
              {review.verified && (
                <span className="px-2 py-1 bg-sage-100 text-sage-800 text-xs font-medium rounded">
                  Verified Purchase
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= review.rating
                      ? 'text-crust-400 fill-current'
                      : 'text-crust-200'
                  )}
                />
              ))}
            </div>

            {/* Content */}
            <h4 className="font-semibold text-crust-900 mb-2">{review.title}</h4>
            <p className="text-crust-600 leading-relaxed">{review.content}</p>

            {/* Helpful Button */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handleHelpful(review.id)}
                className={cn(
                  'flex items-center gap-1.5 text-sm transition-colors',
                  helpfulReviews.has(review.id)
                    ? 'text-crust-900 font-medium'
                    : 'text-crust-500 hover:text-crust-700'
                )}
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
              </button>
              <button className="flex items-center gap-1.5 text-sm text-crust-500 hover:text-crust-700 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Report
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  );
}

export default ReviewSection;
