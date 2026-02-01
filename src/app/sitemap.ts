// ============================================
// L'Artisan Baking Atelier - Dynamic Sitemap
// Auto-generates sitemap for search engines
// ============================================

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { BRAND } from '@/lib/seo/metadata';

// Static routes configuration
const STATIC_ROUTES = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/journal', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/recipes', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/login', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/register', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/forgot-password', priority: 0.2, changeFrequency: 'yearly' },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BRAND.url;
  const now = new Date();

  // Fetch dynamic content
  const [products, categories] = await Promise.all([
    // Fetch all published products
    prisma.product.findMany({
      where: { isAvailable: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    // Fetch all active categories
    prisma.category.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ]);

  // Static routes
  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: route.priority,
  }));

  // Product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Category routes
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/shop?category=${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Combine all routes
  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
