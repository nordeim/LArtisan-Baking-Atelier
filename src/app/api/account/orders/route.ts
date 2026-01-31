import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * Account Orders API
 * 
 * GET: Get current user's order history
 */

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const orders = await prisma.order.findMany({
      where: {
        userId: user.sub,
        status: { not: 'PENDING' }, // Exclude pending orders
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        digitalAccess: {
          where: {
            revokedAt: null,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialize orders with Decimal → number conversion
    const serializedOrders = orders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      gstAmount: Number(order.gstAmount),
      total: Number(order.total),
      items: order.orderItems.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })),
    }));

    return NextResponse.json({ orders: serializedOrders });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
