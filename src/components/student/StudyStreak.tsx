'use client';

// ============================================
// L'Artisan Baking Atelier - Study Streak
// Streak counter with calendar heatmap
// ============================================

import { cn } from '@/lib/utils';
import { Flame, Calendar } from 'lucide-react';

interface StudyActivity {
  date: Date;
  minutes: number;
  lessonsCompleted: number;
}

interface StudyStreakProps {
  currentStreak: number;
  longestStreak: number;
  activities: StudyActivity[];
  className?: string;
}

export function StudyStreak({
  currentStreak,
  longestStreak,
  activities,
  className,
}: StudyStreakProps) {
  // Generate last 30 days for calendar
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });
  
  // Check if a date has activity
  const getActivityForDate = (date: Date) => {
    return activities.find(
      a => a.date.toDateString() === date.toDateString()
    );
  };
  
  // Get activity level (0-4) based on minutes
  const getActivityLevel = (minutes: number): number => {
    if (minutes === 0) return 0;
    if (minutes < 15) return 1;
    if (minutes < 30) return 2;
    if (minutes < 60) return 3;
    return 4;
  };
  
  const activityColors = [
    'bg-crust-100', // 0 - no activity
    'bg-crust-200', // 1 - light
    'bg-crust-300', // 2 - medium
    'bg-crust-400', // 3 - high
    'bg-crust-500', // 4 - intense
  ];
  
  return (
    <div className={cn('bg-white rounded-2xl border border-crust-200 p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-crust-900">
              {currentStreak} Day Streak
            </h3>
            <p className="text-sm text-crust-500">
              Longest: {longestStreak} days
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-crust-800">
            {activities.reduce((sum, a) => sum + a.minutes, 0)}
          </p>
          <p className="text-xs text-crust-500">minutes this month</p>
        </div>
      </div>
      
      {/* Calendar Heatmap */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-crust-600">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
        
        <div className="grid grid-cols-10 gap-1.5">
          {days.map((date, index) => {
            const activity = getActivityForDate(date);
            const level = activity ? getActivityLevel(activity.minutes) : 0;
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={cn(
                  'aspect-square rounded-md transition-all hover:scale-110',
                  activityColors[level],
                  isToday && 'ring-2 ring-crust-400 ring-offset-1'
                )}
                title={activity
                  ? `${date.toLocaleDateString()}: ${activity.minutes} min`
                  : date.toLocaleDateString()
                }
              />
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-3">
          <span className="text-xs text-crust-500">Less</span>
          {activityColors.map((color, i) => (
            <div
              key={i}
              className={cn('w-3 h-3 rounded-sm', color)}
            />
          ))}
          <span className="text-xs text-crust-500">More</span>
        </div>
      </div>
      
      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-crust-50 rounded-xl">
        <p className="text-sm text-crust-700 text-center">
          {currentStreak === 0
            ? "Start learning today to build your streak! 🔥"
            : currentStreak < 3
            ? "Great start! Keep the momentum going! 💪"
            : currentStreak < 7
            ? "You're building a great habit! Keep it up! 🌟"
            : "Incredible dedication! You're on fire! 🔥🔥🔥"
          }
        </p>
      </div>
    </div>
  );
}
