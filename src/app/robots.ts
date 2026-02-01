// ============================================
// L'Artisan Baking Atelier - Robots.txt
// Search engine crawling instructions
// ============================================

import { MetadataRoute } from 'next';
import { BRAND } from '@/lib/seo/metadata';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BRAND.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/admin',
          '/admin/*',
          '/account',
          '/account/*',
          '/api',
          '/api/*',
          '/checkout',
          '/checkout/*',
          '/_next',
          '/monitoring',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin', '/admin/*', '/account', '/account/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
