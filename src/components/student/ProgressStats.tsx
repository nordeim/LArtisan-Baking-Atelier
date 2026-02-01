'use client';

// ============================================
// L'Artisan Baking Atelier - Progress Stats
// Statistics cards for learning dashboard
// ============================================

import { cn } from '@/lib/utils';
import { BookOpen, Clock, Trophy, Award } from 'lucide-react';

interface ProgressStatsProps {
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalLessonsCompleted: number;
    totalWatchTime: number; // minutes
    achievementsEarned: number;
  };
  className?: string;
}

export function ProgressStats({ stats, className }: ProgressStatsProps) {
  const cards = [
    {
      label: 'Courses Completed',
      value: stats.completedCourses,
      total: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-sage-100 text-sage-700',
      showTotal: true,
    },
    {
      label: 'Lessons Watched',
      value: stats.totalLessonsCompleted,
      icon: Award,
      color: 'bg-crust-100 text-crust-700',
      showTotal: false,
    },
    {
      label: 'Watch Time',
      value: formatWatchTime(stats.totalWatchTime),
      icon: Clock,
      color: 'bg-blue-100 text-blue-700',
      showTotal: false,
    },
    {
      label: 'Achievements',
      value: stats.achievementsEarned,
      icon: Trophy,
      color: 'bg-amber-100 text-amber-700',
      showTotal: false,
    },
  ];
  
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-crust-200 p-5 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', card.color)}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-crust-900">
              {card.value}
            </p>
            <p className="text-sm text-crust-500 mt-0.5">
              {card.label}
              {card.showTotal && stats.totalCourses > 0 && (
                <span className="text-crust-400">
                  {' '}of {stats.totalCourses}
                </span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Format watch time
function formatWatchTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) {
    return `${days}d`;
  }
  
  return `${days}d ${remainingHours}h`;
}
