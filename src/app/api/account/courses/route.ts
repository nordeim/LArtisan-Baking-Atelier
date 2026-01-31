import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * Account Courses API (My Courses)
 * 
 * GET: Get current user's purchased digital courses
 */

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const digitalAccess = await prisma.digitalAccess.findMany({
      where: {
        userId: user.sub,
        revokedAt: null,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            images: true,
            price: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        grantedAt: 'desc',
      },
    });

    // Serialize with Decimal → number conversion
    const serializedCourses = digitalAccess.map((access) => ({
      ...access,
      product: {
        ...access.product,
        price: Number(access.product.price),
      },
    }));

    return NextResponse.json({ courses: serializedCourses });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
