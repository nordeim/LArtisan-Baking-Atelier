// ============================================
// L'Artisan Baking Atelier - Progress Overview API
// GET: Get overall learning statistics
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    // Get all digital access
    const accessList = await prisma.digitalAccess.findMany({
      where: {
        userId: user.sub,
        revokedAt: null,
      },
      include: {
        product: {
          include: {
            lessons: true,
          },
        },
        lessonProgress: true,
      },
    });
    
    // Calculate statistics
    const totalCourses = accessList.length;
    let completedCourses = 0;
    let inProgressCourses = 0;
    let totalLessonsCompleted = 0;
    let totalWatchTimeMinutes = 0;
    
    const courseActivities: Date[] = [];
    
    for (const access of accessList) {
      const completedLessons = access.lessonProgress.filter(
        (p) => p.completedAt != null
      ).length;
      
      const totalLessons = access.product.lessons.length;
      
      totalLessonsCompleted += completedLessons;
      
      // Calculate watch time
      for (const progress of access.lessonProgress) {
        if (progress.progressPercent > 0) {
          const lesson = access.product.lessons.find(
            (l) => l.id === progress.lessonId
          );
          if (lesson) {
            totalWatchTimeMinutes += Math.floor(
              (lesson.duration * progress.progressPercent) / 100 / 60
            );
          }
        }
      }
      
      // Track activity dates
      if (access.lastAccessedAt) {
        courseActivities.push(access.lastAccessedAt);
      }
      
      // Determine course status
      if (completedLessons === totalLessons && totalLessons > 0) {
        completedCourses++;
      } else if (completedLessons > 0) {
        inProgressCourses++;
      }
    }
    
    // Calculate streak
    const { currentStreak, longestStreak } = calculateStreak(courseActivities);
    
    // Get achievements count
    // TODO: Add UserAchievement model to schema
    const achievementsCount = 0;
    
    // Get this week's activity
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekActivity = await prisma.lessonProgress.count({
      where: {
        userId: user.sub,
        lastWatchedAt: {
          gte: oneWeekAgo,
        },
      },
    });
    
    return NextResponse.json({
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalLessonsCompleted,
        totalWatchTime: totalWatchTimeMinutes,
        currentStreak,
        longestStreak,
        achievementsEarned: achievementsCount,
        studyTimeThisWeek: thisWeekActivity,
      },
    });
  } catch (error) {
    console.error('Error fetching progress overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overview' },
      { status: 500 }
    );
  }
}

// Helper function to calculate streak
function calculateStreak(activities: Date[]): { currentStreak: number; longestStreak: number } {
  if (activities.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  // Get unique dates
  const uniqueDates = [...new Set(activities.map(d => d.toDateString()))].map(
    d => new Date(d)
  );
  
  uniqueDates.sort((a, b) => b.getTime() - a.getTime());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Calculate current streak
  let currentStreak = 0;
  let checkDate = today;
  
  // Check if there's activity today
  const hasActivityToday = uniqueDates.some(
    d => d.getTime() === today.getTime()
  );
  
  if (!hasActivityToday) {
    // Check yesterday
    const hasActivityYesterday = uniqueDates.some(
      d => d.getTime() === yesterday.getTime()
    );
    
    if (!hasActivityYesterday) {
      return { currentStreak: 0, longestStreak: calculateLongestStreak(uniqueDates) };
    }
    
    checkDate = yesterday;
  }
  
  // Count back consecutive days
  while (true) {
    const hasActivity = uniqueDates.some(
      d => d.getTime() === checkDate.getTime()
    );
    
    if (hasActivity) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, calculateLongestStreak(uniqueDates)),
  };
}

function calculateLongestStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  
  let maxStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1]!;
    const currDate = dates[i]!;
    const diff = Math.abs(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
}
