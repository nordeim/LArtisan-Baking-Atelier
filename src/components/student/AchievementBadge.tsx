'use client';

// ============================================
// L'Artisan Baking Atelier - Achievement Badge
// Badge display component with unlock animation
// ============================================

import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Lock, Award, Star, Zap, Target, Sun, Moon, Trophy, BookOpen, Medal } from 'lucide-react';

// Achievement icon mapping
const achievementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'first-course': Medal,
  'course-collector': Award,
  'master-baker': Trophy,
  'speed-learner': Zap,
  'perfect-score': Target,
  'early-bird': Sun,
  'night-owl': Moon,
  'weekend-warrior': Star,
  'first-lesson': BookOpen,
  'halfway-there': Award,
  default: Star,
};

// Achievement rarity colors
const rarityColors = {
  common: 'bg-crust-100 text-crust-700 border-crust-200',
  rare: 'bg-blue-50 text-blue-700 border-blue-200',
  epic: 'bg-purple-50 text-purple-700 border-purple-200',
  legendary: 'bg-amber-50 text-amber-700 border-amber-200',
};

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  achievementId: string;
  earnedAt: Date;
}

export interface AchievementProgress {
  achievementId: string;
  progress: number; // 0-100
}

interface AchievementBadgeProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  progress?: number; // Progress percentage for in-progress achievements
  className?: string;
  showDetails?: boolean;
}

export function AchievementBadge({
  achievement,
  userAchievement,
  progress,
  className,
  showDetails = true,
}: AchievementBadgeProps) {
  const isEarned = userAchievement != null;
  const Icon = achievementIcons[achievement.icon] ?? achievementIcons.default;
  if (!Icon) return null;
  const rarityStyle = rarityColors[achievement.rarity];
  
  return (
    <div
      className={cn(
        'relative p-4 rounded-2xl border-2 transition-all duration-300',
        isEarned
          ? cn('bg-white', rarityStyle)
          : 'bg-crust-50 border-crust-200 opacity-60 grayscale',
        'hover:scale-105 hover:shadow-md',
        className
      )}
    >
      {/* Locked Overlay */}
      {!isEarned && (
        <div className="absolute inset-0 flex items-center justify-center bg-crust-50/80 rounded-2xl">
          <Lock className="w-8 h-8 text-crust-400" />
        </div>
      )}
      
      {/* Icon */}
      <div className={cn(
        'w-16 h-16 rounded-full flex items-center justify-center mb-3 mx-auto',
        isEarned ? 'bg-white shadow-sm' : 'bg-crust-100'
      )}>
        <Icon className={cn(
          'w-8 h-8',
          isEarned ? 'text-crust-600' : 'text-crust-400'
        )} />
      </div>
      
      {/* Content */}
      {showDetails && (
        <div className="text-center">
          <h4 className={cn(
            'font-display font-semibold text-sm mb-1',
            isEarned ? 'text-crust-900' : 'text-crust-500'
          )}>
            {achievement.name}
          </h4>
          
          <p className="text-xs text-crust-600 mb-2 line-clamp-2">
            {achievement.description}
          </p>
          
          {/* Points & Rarity */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-medium text-crust-500">
              {achievement.points} pts
            </span>
            <span className="text-xs text-crust-300">•</span>
            <span className={cn(
              'text-xs font-medium capitalize',
              achievement.rarity === 'legendary' && 'text-amber-600',
              achievement.rarity === 'epic' && 'text-purple-600',
              achievement.rarity === 'rare' && 'text-blue-600',
              achievement.rarity === 'common' && 'text-crust-500',
            )}>
              {achievement.rarity}
            </span>
          </div>
          
          {/* Earned Date */}
          {isEarned && (
            <p className="text-xs text-crust-400 mt-2">
              Earned {formatDistanceToNow(userAchievement.earnedAt, { addSuffix: true })}
            </p>
          )}
          
          {/* Progress */}
          {!isEarned && progress !== undefined && progress > 0 && (
            <div className="mt-2">
              <div className="h-1.5 bg-crust-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-crust-400 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-crust-500 mt-1">
                {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Achievement Grid Component
interface AchievementGridProps {
  achievements: Array<{
    achievement: Achievement;
    userAchievement?: UserAchievement;
  }>;
  className?: string;
}

export function AchievementGrid({ achievements, className }: AchievementGridProps) {
  // Sort: earned first, then by rarity
  const sorted = [...achievements].sort((a, b) => {
    if (a.userAchievement && !b.userAchievement) return -1;
    if (!a.userAchievement && b.userAchievement) return 1;
    
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
    return rarityOrder[a.achievement.rarity] - rarityOrder[b.achievement.rarity];
  });
  
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4', className)}>
      {sorted.map(({ achievement, userAchievement }) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          userAchievement={userAchievement}
        />
      ))}
    </div>
  );
}
