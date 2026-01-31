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

/**
 * Serialized product type for client components
 * All Decimal fields are converted to numbers for serialization
 */
export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  gstRate: number;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  images: string[];
  weight: number | null;
  isDigital: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
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
  products: SerializedProduct[];
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

  // Serialize products for client components (convert Decimal to number)
  const serializedProducts = products.map((product) => serializeProduct(product));

  return {
    products: serializedProducts,
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
 * @returns Product with category or null (serialized for client components)
 */
export async function getProductBySlug(slug: string): Promise<SerializedProduct | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) return null;

  return serializeProduct(product);
}

/**
 * Fetch related products
 * 
 * @param productId - Current product ID
 * @param categoryId - Category ID for matching
 * @param limit - Number of products to fetch
 * @returns Related products (serialized for client components)
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4
): Promise<SerializedProduct[]> {
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

  return products.map((product) => serializeProduct(product));
}

/**
 * Fetch featured products for homepage
 * 
 * @param limit - Number of products to fetch
 * @returns Featured products (serialized for client components)
 */
export async function getFeaturedProducts(limit = 4): Promise<SerializedProduct[]> {
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

  return products.map((product) => serializeProduct(product));
}

// ============================================
// Serialization Utilities
// ============================================

/**
 * Serialize a product for client components
 * Converts Prisma Decimal fields to plain JavaScript numbers
 * and Date objects to ISO strings
 */
export function serializeProduct<T extends { category: Category | null }>(
  product: Product & T
): SerializedProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    gstRate: Number(product.gstRate),
    sku: product.sku,
    stockQuantity: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold,
    images: product.images,
    weight: product.weight ? Number(product.weight) : null,
    isDigital: product.isDigital,
    isAvailable: product.isAvailable,
    isFeatured: product.isFeatured,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: product.category,
  };
}
