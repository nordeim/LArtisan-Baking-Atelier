import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

/**
 * Admin Products API
 * 
 * GET: List all products
 * POST: Create new product
 */

// Validation schema for creating/updating products
const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  shortDescription: z.string().max(500).optional(),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().nullable().optional(),
  gstRate: z.number().min(0).max(1).default(0.09),
  sku: z.string().min(1).max(100),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  categoryId: z.string().nullable().optional(),
  images: z.array(z.string().url()).default([]),
  weight: z.number().positive().nullable().optional(),
  isDigital: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(200).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),
});

export async function GET() {
  try {
    // Verify admin
    const admin = await requireAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        _count: { select: { orderItems: true } },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin
    const admin = await requireAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = productSchema.parse(body);

    // Check for duplicate slug
    const existing = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Create product
    const { categoryId, ...data } = validatedData;
    const product = await prisma.product.create({
      data: {
        ...data,
        description: data.description || '',
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: (error as z.ZodError).issues },
        { status: 400 }
      );
    }

    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
