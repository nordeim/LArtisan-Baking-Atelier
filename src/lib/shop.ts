/**
 * Shop Data Fetching Utilities
 * 
 * Server-side functions for fetching products with filtering,
 * sorting, and pagination support.
 */

import { prisma } from '@/lib/prisma';
import type { Product, Category } from '@prisma/client';

// ============================================
// Types
// ============================================

export interface ProductWithCategory extends Product {
  category: Category | null;
}

export interface ShopFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface ShopResult {
  products: ProductWithCategory[];
  total: number;
  totalPages: number;
  currentPage: number;
  categories: Category[];
  priceRange: {
    min: number;
    max: number;
  };
}

// ============================================
// Product Fetching
// ============================================

/**
 * Fetch products with filters, sorting, and pagination
 * 
 * @param filters - Search and filter options
 * @returns Shop result with products and metadata
 */
export async function getProducts(filters: ShopFilters = {}): Promise<ShopResult> {
  const {
    category,
    minPrice,
    maxPrice,
    search,
    sortBy = 'newest',
    page = 1,
    limit = 12,
  } = filters;

  // Build where clause
  const where: Record<string, unknown> = {
    isAvailable: true,
  };

  // Category filter
  if (category && category !== 'all') {
    where.category = {
      slug: category,
    };
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      (where.price as Record<string, unknown>).gte = minPrice;
    }
    if (maxPrice !== undefined) {
      (where.price as Record<string, unknown>).lte = maxPrice;
    }
  }

  // Search filter
  if (search && search.trim()) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Build order by
  let orderBy: Record<string, string> = {};
  switch (sortBy) {
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'name_asc':
      orderBy = { name: 'asc' };
      break;
    case 'name_desc':
      orderBy = { name: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  // Execute queries in parallel
  const [products, total, categories, priceRangeResult] = await Promise.all([
    // Fetch products
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
      },
    }),
    // Count total
    prisma.product.count({ where }),
    // Fetch all categories for filter
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    // Get price range
    prisma.product.aggregate({
      where: { isAvailable: true },
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Convert Decimal prices to numbers
  const productsWithNumbers = products.map((product: ProductWithCategory) => ({
    ...product,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
  }));

  return {
    products: productsWithNumbers as ProductWithCategory[],
    total,
    totalPages,
    currentPage: page,
    categories,
    priceRange: {
      min: Number(priceRangeResult._min.price ?? 0),
      max: Number(priceRangeResult._max.price ?? 100000),
    },
  };
}

/**
 * Fetch a single product by slug
 * 
 * @param slug - Product slug
 * @returns Product with category or null
 */
export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  return product as ProductWithCategory | null;
}

/**
 * Fetch related products
 * 
 * @param productId - Current product ID
 * @param categoryId - Category ID for matching
 * @param limit - Number of products to fetch
 * @returns Related products
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4
): Promise<ProductWithCategory[]> {
  const products = await prisma.product.findMany({
    where: {
      id: { not: productId },
      isAvailable: true,
      ...(categoryId && {
        categoryId,
      }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      category: true,
    },
  });

  return products as ProductWithCategory[];
}

/**
 * Fetch featured products for homepage
 * 
 * @param limit - Number of products to fetch
 * @returns Featured products
 */
export async function getFeaturedProducts(limit = 4): Promise<ProductWithCategory[]> {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      category: true,
    },
  });

  return products as ProductWithCategory[];
}
