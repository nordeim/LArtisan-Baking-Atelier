// ============================================
// L'Artisan Baking Atelier - JSON-LD Structured Data
// Schema.org markup for rich search results
// ============================================

import { BRAND } from './metadata';

// Base types for Schema.org
interface SchemaOrgBase {
  '@context': 'https://schema.org';
  '@type': string;
}

// Organization Schema
export interface OrganizationSchema extends SchemaOrgBase {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  address?: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressLocality?: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email: string;
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.name,
    url: BRAND.url,
    logo: `${BRAND.url}${BRAND.logo}`,
    description: BRAND.description,
    sameAs: [
      'https://twitter.com/ArtisanBakingSG',
      'https://facebook.com/artisanbakingatelier',
      'https://instagram.com/artisanbakingatelier',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SG',
      addressLocality: 'Singapore',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@artisan-baking.com',
    },
  };
}

// Website Schema with Search
export interface WebsiteSchema extends SchemaOrgBase {
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND.name,
    url: BRAND.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BRAND.url}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// Course Schema (for products)
export interface CourseSchema extends SchemaOrgBase {
  '@type': 'Course';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
    sameAs: string;
  };
  image?: string;
  url?: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
  educationalLevel?: string;
  timeRequired?: string;
}

export function generateCourseSchema(course: {
  name: string;
  description: string;
  image?: string;
  url?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
}): CourseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: BRAND.name,
      sameAs: BRAND.url,
    },
    image: course.image,
    url: course.url,
    offers: course.price
      ? {
          '@type': 'Offer',
          price: course.price.toString(),
          priceCurrency: 'SGD',
          availability: 'https://schema.org/InStock',
        }
      : undefined,
    aggregateRating:
      course.rating && course.reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: course.rating.toString(),
            reviewCount: course.reviewCount.toString(),
          }
        : undefined,
    educationalLevel: course.level,
    timeRequired: course.duration,
  };
}

// Product Schema (for e-commerce)
export interface ProductSchema extends SchemaOrgBase {
  '@type': 'Product';
  name: string;
  description: string;
  image?: string[];
  sku?: string;
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  offers?: {
    '@type': 'Offer';
    url?: string;
    price: string;
    priceCurrency: string;
    priceValidUntil?: string;
    availability: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
  review?: ReviewSchema[];
}

export interface ReviewSchema extends SchemaOrgBase {
  '@type': 'Review';
  author: {
    '@type': 'Person';
    name: string;
  };
  datePublished: string;
  reviewBody: string;
  reviewRating: {
    '@type': 'Rating';
    ratingValue: string;
    bestRating: string;
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image?: string[];
  sku?: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
  rating?: number;
  reviewCount?: number;
  reviews?: ReviewSchema[];
}): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: BRAND.name,
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: product.currency || 'SGD',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
    },
    aggregateRating:
      product.rating && product.reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating.toString(),
            reviewCount: product.reviewCount.toString(),
          }
        : undefined,
    review: product.reviews,
  };
}

// Breadcrumb Schema
export interface BreadcrumbSchema extends SchemaOrgBase {
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
}

export function generateBreadcrumbSchema(
  items: { name: string; url?: string }[]
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ Schema
export interface FAQSchema extends SchemaOrgBase {
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }[];
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Recipe Schema
export interface RecipeSchema extends SchemaOrgBase {
  '@type': 'Recipe';
  name: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  image: string[];
  description: string;
  recipeYield: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeIngredient: string[];
  recipeInstructions: {
    '@type': 'HowToStep';
    text: string;
  }[];
  nutrition?: {
    '@type': 'NutritionInformation';
    calories: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
}

export function generateRecipeSchema(recipe: {
  name: string;
  author: string;
  image: string[];
  description: string;
  yield: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients: string[];
  instructions: string[];
  calories?: string;
  rating?: number;
  reviewCount?: number;
}): RecipeSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    author: {
      '@type': 'Person',
      name: recipe.author,
    },
    image: recipe.image,
    description: recipe.description,
    recipeYield: recipe.yield,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((instruction) => ({
      '@type': 'HowToStep',
      text: instruction,
    })),
    nutrition: recipe.calories
      ? {
          '@type': 'NutritionInformation',
          calories: recipe.calories,
        }
      : undefined,
    aggregateRating:
      recipe.rating && recipe.reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: recipe.rating.toString(),
            reviewCount: recipe.reviewCount.toString(),
          }
        : undefined,
  };
}

// Helper to serialize schema for use in scripts
export function serializeSchema(schema: unknown): string {
  return JSON.stringify(schema, null, 0);
}
