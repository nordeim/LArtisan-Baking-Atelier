'use client';

// ============================================
// L'Artisan Baking Atelier - Lesson List
// List of lessons with status indicators
// ============================================

import { cn, formatDuration } from '@/lib/utils';
import { CheckCircle, Circle, Play, Lock, Clock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: number;
  order: number;
  isPreview: boolean;
  thumbnailUrl?: string;
  progress?: {
    progressPercent: number;
    completedAt?: Date;
    currentTime: number;
  } | null;
}

interface LessonListProps {
  lessons: Lesson[];
  activeLessonId?: string;
  onSelect: (lesson: Lesson) => void;
  className?: string;
}

export function LessonList({
  lessons,
  activeLessonId,
  onSelect,
  className,
}: LessonListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {lessons.map((lesson, index) => {
        const isCompleted = lesson.progress?.completedAt != null;
        const isInProgress = lesson.progress && lesson.progress.progressPercent > 0 && !isCompleted;
        const isLocked = index > 0 && !lessons[index - 1]?.progress?.completedAt;
        const isActive = lesson.id === activeLessonId;
        
        return (
          <button
            key={lesson.id}
            onClick={() => !isLocked && onSelect(lesson)}
            disabled={isLocked}
            className={cn(
              'w-full text-left p-4 rounded-xl border transition-all duration-200',
              'flex items-start gap-3',
              isActive
                ? 'bg-crust-50 border-crust-400 ring-1 ring-crust-400'
                : isLocked
                ? 'bg-crust-50/50 border-crust-200 cursor-not-allowed'
                : 'bg-white border-crust-200 hover:border-crust-300 hover:shadow-sm'
            )}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {isLocked ? (
                <Lock className="w-5 h-5 text-crust-400" />
              ) : isCompleted ? (
                <CheckCircle className="w-5 h-5 text-sage-500" />
              ) : isInProgress ? (
                <div className="relative">
                  <Circle className="w-5 h-5 text-crust-400" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-3 h-3 rounded-full bg-crust-400"
                      style={{
                        background: `conic-gradient(var(--color-crust-400) ${lesson.progress?.progressPercent || 0}%, transparent 0)`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <Circle className="w-5 h-5 text-crust-300" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-crust-500 font-medium">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className={cn(
                  'font-medium text-sm truncate',
                  isLocked ? 'text-crust-400' : 'text-crust-900'
                )}>
                  {lesson.title}
                </h4>
              </div>
              
              {lesson.description && (
                <p className="text-xs text-crust-500 mt-1 line-clamp-2">
                  {lesson.description}
                </p>
              )}
              
              {/* Duration & Progress */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs text-crust-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(lesson.duration)}</span>
                </div>
                
                {isInProgress && lesson.progress && (
                  <div className="flex items-center gap-1 text-xs text-crust-600">
                    <Play className="w-3 h-3" />
                    <span>{Math.round(lesson.progress.progressPercent)}% watched</span>
                  </div>
                )}
                
                {lesson.isPreview && (
                  <span className="text-xs font-medium text-sage-600 bg-sage-100 px-2 py-0.5 rounded-full">
                    Preview
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
