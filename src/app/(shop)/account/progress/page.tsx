// ============================================
// L'Artisan Baking Atelier - Progress Dashboard
// Student learning progress overview page
// ============================================

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-client';
import { prisma } from '@/lib/prisma';
import { ProgressStats } from '@/components/student/ProgressStats';
import { CourseProgressCard } from '@/components/student/CourseProgressCard';
import { StudyStreak } from '@/components/student/StudyStreak';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'My Progress',
  description: 'Track your learning progress, view achievements, and continue your baking journey.',
});

export default async function ProgressPage() {
  // Check authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  
  // Fetch progress data
  const [progressData, overviewData] = await Promise.all([
    // Get course progress
    prisma.digitalAccess.findMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      include: {
        product: {
          include: {
            category: true,
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                progress: {
                  where: { userId: user.id },
                },
              },
            },
          },
        },
        lessonProgress: {
          include: { lesson: true },
          orderBy: { lastWatchedAt: 'desc' },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    }),
    // Get overview stats
    getOverviewStats(user.id),
  ]);
  
  // Process progress data
  const courses = progressData.map((access) => {
    const completedLessons = access.lessonProgress.filter(
      (p) => p.completedAt != null
    ).length;
    
    const totalLessons = access.product.lessons.length;
    
    const nextLesson = access.product.lessons.find((lesson) => {
      const progress = access.lessonProgress.find(
        (p) => p.lessonId === lesson.id
      );
      return !progress?.completedAt;
    });
    
    return {
      course: {
        id: access.product.id,
        name: access.product.name,
        slug: access.product.slug,
        image: access.product.images[0],
        price: Number(access.product.price),
        category: access.product.category ? { name: access.product.category.name } : undefined,
      },
      progress: {
        completedLessons,
        totalLessons,
        lastAccessedAt: access.lastAccessedAt || undefined,
        nextLesson: nextLesson
          ? { id: nextLesson.id, title: nextLesson.title }
          : undefined,
      },
    };
  });
  
  // Get activities for streak
  const activities = progressData
    .filter((a) => a.lastAccessedAt)
    .map((a) => ({
      date: a.lastAccessedAt!,
      minutes: Math.floor(a.accessCount * 10),
      lessonsCompleted: a.lessonProgress.filter((p) => p.completedAt).length,
    }));
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-crust-900 mb-2">
          My Progress
        </h1>
        <p className="text-crust-600">
          Track your learning journey and celebrate your achievements.
        </p>
      </div>
      
      {/* Stats */}
      <ProgressStats stats={overviewData} />
      
      {/* Streak & Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-semibold text-crust-900 mb-4">
            My Courses
          </h2>
          
          {courses.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map(({ course, progress }) => (
                <CourseProgressCard
                  key={course.id}
                  course={course}
                  progress={progress}
                />
              ))}
            </div>
          ) : (
            <div className="bg-crust-50 rounded-2xl border border-crust-200 p-8 text-center">
              <p className="text-crust-600 mb-4">
                You haven&apos;t enrolled in any courses yet.
              </p>
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-4 py-2 bg-crust-800 text-white rounded-lg hover:bg-crust-900 transition-colors"
              >
                Browse Courses
              </a>
            </div>
          )}
        </div>
        
        <div>
          <StudyStreak
            currentStreak={overviewData.currentStreak}
            longestStreak={overviewData.longestStreak}
            activities={activities}
          />
        </div>
      </div>
    </div>
  );
}

// Helper to get overview stats
async function getOverviewStats(userId: string) {
  const accessList = await prisma.digitalAccess.findMany({
    where: {
      userId,
      revokedAt: null,
    },
    include: {
      product: {
        include: { lessons: true },
      },
      lessonProgress: true,
    },
  });
  
  let completedCourses = 0;
  let inProgressCourses = 0;
  let totalLessonsCompleted = 0;
  let totalWatchTimeMinutes = 0;
  
  for (const access of accessList) {
    const completedLessons = access.lessonProgress.filter(
      (p) => p.completedAt != null
    ).length;
    
    totalLessonsCompleted += completedLessons;
    
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
    
    if (completedLessons === access.product.lessons.length) {
      completedCourses++;
    } else if (completedLessons > 0) {
      inProgressCourses++;
    }
  }
  
  // TODO: Add UserAchievement model to schema
  const achievementsCount = 0;
  
  return {
    totalCourses: accessList.length,
    completedCourses,
    inProgressCourses,
    totalLessonsCompleted,
    totalWatchTime: totalWatchTimeMinutes,
    currentStreak: 0,
    longestStreak: 0,
    achievementsEarned: achievementsCount,
  };
}
