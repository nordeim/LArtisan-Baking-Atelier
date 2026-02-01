'use client';

// ============================================
// L'Artisan Baking Atelier - Course Progress Card
// Course card with progress indicator for student dashboard
// ============================================

import Link from 'next/link';
import Image from 'next/image';
import { ProgressRing } from './ProgressRing';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface CourseProgressCardProps {
  course: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    price: number;
    category?: {
      name: string;
    };
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    lastAccessedAt?: Date;
    nextLesson?: {
      id: string;
      title: string;
    };
  };
  className?: string;
}

export function CourseProgressCard({
  course,
  progress,
  className,
}: CourseProgressCardProps) {
  const percent = progress.totalLessons > 0
    ? (progress.completedLessons / progress.totalLessons) * 100
    : 0;
  
  const isStarted = progress.completedLessons > 0;
  const isComplete = percent === 100;
  
  return (
    <div
      className={cn(
        'group bg-white rounded-2xl border border-crust-200 overflow-hidden',
        'shadow-card hover:shadow-card-hover transition-all duration-300',
        'card-lift',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.image || '/images/placeholder-course.jpg'}
          alt={course.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Progress Badge */}
        <div className="absolute top-4 right-4">
          <ProgressRing
            percent={percent}
            size={56}
            strokeWidth={4}
            showPercentage={false}
          />
        </div>
        
        {/* Category Badge */}
        {course.category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-crust-900/80 text-crust-50 text-xs font-medium rounded-full">
              {course.category.name}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-crust-900 mb-2 line-clamp-1">
          {course.name}
        </h3>
        
        {/* Progress Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-crust-600">
            <span className="font-semibold text-crust-800">{progress.completedLessons}</span>
            {' / '}
            <span>{progress.totalLessons}</span>
            {' '}lessons
          </div>
          
          <div className="text-sm font-semibold text-crust-800">
            {Math.round(percent)}% complete
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-crust-100 rounded-full overflow-hidden mb-4">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isComplete ? 'bg-sage-500' : 'bg-crust-400'
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        
        {/* Last Accessed */}
        {progress.lastAccessedAt && (
          <p className="text-xs text-crust-500 mb-4">
            Last accessed {formatDistanceToNow(progress.lastAccessedAt, { addSuffix: true })}
          </p>
        )}
        
        {/* Next Lesson */}
        {progress.nextLesson && !isComplete && (
          <p className="text-sm text-crust-600 mb-4 line-clamp-1">
            <span className="font-medium">Next:</span> {progress.nextLesson.title}
          </p>
        )}
        
        {/* Action Button */}
        <Link
          href={`/account/courses/${course.id}`}
          className="block"
        >
          <Button
            className={cn(
              'w-full',
              isComplete
                ? 'bg-sage-500 hover:bg-sage-600 text-white'
                : 'bg-crust-800 hover:bg-crust-900 text-white'
            )}
          >
            {isComplete ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Review Course
              </>
            ) : isStarted ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Course
              </>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}
