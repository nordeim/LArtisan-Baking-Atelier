import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

/**
 * Admin Single Product API
 * 
 * GET: Fetch product details
 * PATCH: Update product
 * DELETE: Delete product
 */

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(5000).optional(),
  shortDescription: z.string().max(500).optional(),
  price: z.number().int().positive().optional(),
  compareAtPrice: z.number().int().positive().nullable().optional(),
  gstRate: z.number().min(0).max(1).optional(),
  sku: z.string().min(1).max(100).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  categoryId: z.string().nullable().optional(),
  images: z.array(z.string().url()).optional(),
  weight: z.number().positive().nullable().optional(),
  isDigital: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().max(200).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),
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

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        _count: { select: { orderItems: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Get product error:', error);
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

    // If slug is being updated, check for duplicates
    if (validatedData.slug) {
      const existing = await prisma.product.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: (error as z.ZodError).issues },
        { status: 400 }
      );
    }

    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if product has orders
    const product = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true } } },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product._count.orderItems > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders' },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
