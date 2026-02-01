// ============================================
// L'Artisan Baking Atelier - Progress API
// GET: Get all course progress for user
// POST: Update lesson progress
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/account/progress - Get all progress
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    // Get all digital access with course and lesson progress
    const progress = await prisma.digitalAccess.findMany({
      where: {
        userId: user.sub,
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
                  where: { userId: user.sub },
                },
              },
            },
          },
        },
        lessonProgress: {
          include: {
            lesson: true,
          },
          orderBy: {
            lastWatchedAt: 'desc',
          },
        },
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
    });
    
    // Calculate progress for each course
    const progressWithStats = progress.map((access) => {
      const completedLessons = access.lessonProgress.filter(
        (p) => p.completedAt != null
      ).length;
      
      const totalLessons = access.product.lessons.length;
      const percentComplete = totalLessons > 0
        ? (completedLessons / totalLessons) * 100
        : 0;
      
      // Find next lesson
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
          image: access.product.images[0] || null,
          category: access.product.category ? { name: access.product.category.name } : null,
        },
        progress: {
          completedLessons,
          totalLessons,
          percentComplete,
          lastAccessedAt: access.lastAccessedAt,
          nextLesson: nextLesson
            ? {
                id: nextLesson.id,
                title: nextLesson.title,
              }
            : null,
        },
      };
    });
    
    return NextResponse.json({ progress: progressWithStats });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST /api/account/progress - Update lesson progress
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    
    const {
      lessonId,
      currentTime,
      progressPercent,
      completed,
      digitalAccessId,
    } = body;
    
    // Validate required fields
    if (!lessonId || digitalAccessId == null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify the lesson exists and user has access
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: { product: true },
    });
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Verify digital access
    const access = await prisma.digitalAccess.findFirst({
      where: {
        id: digitalAccessId,
        userId: user.sub,
        productId: lesson.productId,
        revokedAt: null,
      },
    });
    
    if (!access) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.sub,
          lessonId: lessonId,
        },
      },
      update: {
        currentTime: currentTime ?? 0,
        progressPercent: progressPercent ?? 0,
        completedAt: completed ? new Date() : undefined,
        lastWatchedAt: new Date(),
        watchCount: {
          increment: 1,
        },
      },
      create: {
        userId: user.sub,
        lessonId: lessonId,
        digitalAccessId: digitalAccessId,
        currentTime: currentTime ?? 0,
        progressPercent: progressPercent ?? 0,
        completedAt: completed ? new Date() : null,
        lastWatchedAt: new Date(),
        watchCount: 1,
      },
    });
    
    // Update digital access last accessed
    await prisma.digitalAccess.update({
      where: { id: digitalAccessId },
      data: {
        lastAccessedAt: new Date(),
        accessCount: {
          increment: 1,
        },
      },
    });
    
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
