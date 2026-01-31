import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';
import { OrderStatus } from '@prisma/client';

/**
 * Admin Order API
 * 
 * GET: Fetch order details
 * PATCH: Update order status and tracking
 */

const updateSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  trackingNumber: z.string().max(100).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    const admin = await requireAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: {
          include: {
            product: { select: { name: true, sku: true, images: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    const admin = await requireAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Validate input
    const validatedData = updateSchema.parse(body);

    // Update order
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.trackingNumber !== undefined && {
          trackingNumber: validatedData.trackingNumber || null,
        }),
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: (error as z.ZodError).issues },
        { status: 400 }
      );
    }

    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
