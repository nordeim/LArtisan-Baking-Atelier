// ============================================
// L'Artisan Baking Atelier - SEO Metadata Utilities
// Centralized metadata configuration for all pages
// ============================================

import type { Metadata } from 'next';

// Brand Configuration
export const BRAND = {
  name: "L'Artisan Baking Atelier",
  tagline: "Singapore's Premier Artisan Baking School",
  description: "Master the art of artisan baking with expert-led courses. Learn sourdough, pâtisserie, and viennoiserie from professional bakers in Singapore.",
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://artisan-baking.com',
  logo: '/images/brand/logo.svg',
  ogImage: '/images/brand/og-image.jpg',
  twitterHandle: '@ArtisanBakingSG',
  locale: 'en_SG',
  country: 'Singapore',
} as const;

// Default Metadata Template
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} | ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [
    'baking courses',
    'artisan bread',
    'sourdough',
    'patisserie',
    'viennoiserie',
    'baking school',
    'Singapore',
    'online baking classes',
    'bread making',
    'croissant',
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: BRAND.locale,
    siteName: BRAND.name,
    title: BRAND.name,
    description: BRAND.description,
    url: BRAND.url,
    images: [
      {
        url: `${BRAND.url}${BRAND.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - ${BRAND.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: BRAND.twitterHandle,
    creator: BRAND.twitterHandle,
    title: BRAND.name,
    description: BRAND.description,
    images: [`${BRAND.url}${BRAND.ogImage}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: './',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
};

// Helper function to generate page metadata
interface PageMetadataOptions {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, keywords, ogImage, canonical, noIndex } = options;

  return {
    ...defaultMetadata,
    title: `${title} | ${BRAND.name}`,
    description: description || BRAND.description,
    keywords: keywords ? [...defaultMetadata.keywords || [], ...keywords] : defaultMetadata.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${title} | ${BRAND.name}`,
      description: description || BRAND.description,
      images: ogImage
        ? [
            {
              url: ogImage.startsWith('http') ? ogImage : `${BRAND.url}${ogImage}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${title} | ${BRAND.name}`,
      description: description || BRAND.description,
      images: ogImage
        ? [ogImage.startsWith('http') ? ogImage : `${BRAND.url}${ogImage}`]
        : defaultMetadata.twitter?.images,
    },
    alternates: {
      canonical: canonical || './',
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : defaultMetadata.robots,
  };
}

// Specific page metadata generators
export const shopMetadata = generatePageMetadata({
  title: 'Baking Courses',
  description: 'Explore our artisan baking courses. From sourdough to pâtisserie, learn from expert bakers in Singapore.',
  keywords: ['baking courses', 'online classes', 'sourdough', 'pastry'],
});

export const checkoutMetadata = generatePageMetadata({
  title: 'Checkout',
  description: 'Complete your purchase and start your baking journey today.',
  noIndex: true,
});

export const accountMetadata = generatePageMetadata({
  title: 'My Account',
  description: 'Manage your courses, track progress, and update your profile.',
  noIndex: true,
});

export const adminMetadata = generatePageMetadata({
  title: 'Admin Dashboard',
  description: 'Manage orders, products, and view analytics.',
  noIndex: true,
});
