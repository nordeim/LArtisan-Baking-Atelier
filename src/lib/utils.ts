/**
 * Common Utility Functions
 * 
 * Helper functions used throughout the application.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// Tailwind Class Utilities
// ============================================

/**
 * Merge Tailwind CSS classes with proper precedence
 * 
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * ```tsx
 * <div className={cn('p-4', isActive && 'bg-blue-500', className)} />
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================
// Date Formatting
// ============================================

/**
 * Format date for display
 * 
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Jan 31, 2026")
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-SG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format date and time for display
 * 
 * @param date - Date to format
 * @returns Formatted date and time string (e.g., "Jan 31, 2026, 2:30 PM")
 */
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-SG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * 
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(d);
}

/**
 * Format duration in seconds to human-readable string
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1:30", "1:30:00")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `0:${seconds.toString().padStart(2, '0')}`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ============================================
// String Utilities
// ============================================

/**
 * Generate URL-friendly slug from text
 * 
 * @param text - Text to convert
 * @returns URL slug
 * 
 * @example
 * ```typescript
 * slugify("Hello World!") // "hello-world"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Truncate text with ellipsis
 * 
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text
 * 
 * @example
 * ```typescript
 * truncate("Hello World", 5) // "Hello..."
 * ```
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }
  return text.slice(0, length).trim() + '...';
}

/**
 * Capitalize first letter of each word
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate initials from name
 * 
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 * 
 * @example
 * ```typescript
 * getInitials("John Doe") // "JD"
 * getInitials("Jane") // "J"
 * ```
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================
// Order Utilities
// ============================================

/**
 * Generate unique order number
 * 
 * Format: ORD-YYYYMMDD-XXXX
 * 
 * @returns Order number string
 * 
 * @example
 * ```typescript
 * generateOrderNumber() // "ORD-20260131-ABCD"
 * ```
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
}

/**
 * Generate SKU from product info
 * 
 * @param category - Category code (e.g., "SD", "PT")
 * @param number - Product number
 * @returns SKU string
 * 
 * @example
 * ```typescript
 * generateSKU("SD", 1) // "SD-001"
 * generateSKU("PT", 42) // "PT-042"
 * ```
 */
export function generateSKU(category: string, number: number): string {
  const paddedNumber = number.toString().padStart(3, '0');
  return `${category.toUpperCase()}-${paddedNumber}`;
}

// ============================================
// Number Utilities
// ============================================

/**
 * Format number with thousands separator
 * 
 * @param num - Number to format
 * @returns Formatted string
 * 
 * @example
 * ```typescript
 * formatNumber(1000) // "1,000"
 * formatNumber(1000000) // "1,000,000"
 * ```
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-SG').format(num);
}

/**
 * Clamp number between min and max
 * 
 * @param num - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

// ============================================
// Array Utilities
// ============================================

/**
 * Group array items by key
 * 
 * @param array - Array to group
 * @param key - Key function
 * @returns Grouped object
 * 
 * @example
 * ```typescript
 * groupBy([{category: 'A'}, {category: 'B'}], item => item.category)
 * // { A: [{category: 'A'}], B: [{category: 'B'}] }
 * ```
 */
export function groupBy<T>(array: T[], key: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Remove duplicates from array
 * 
 * @param array - Array with potential duplicates
 * @returns Array with unique items
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 * 
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j]!;
    newArray[j] = temp!;
  }
  return newArray;
}

// ============================================
// URL Utilities
// ============================================

/**
 * Build URL with query parameters
 * 
 * @param baseUrl - Base URL
 * @param params - Query parameters
 * @returns URL string
 * 
 * @example
 * ```typescript
 * buildUrl('/products', { category: 'bread', page: 1 })
 * // "/products?category=bread&page=1"
 * ```
 */
export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(baseUrl, 'http://localhost');
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  
  return url.pathname + url.search;
}

/**
 * Get file extension from filename
 * 
 * @param filename - Filename
 * @returns File extension (lowercase)
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Check if value is a valid email
 * 
 * @param email - Email to validate
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if value is a valid URL
 * 
 * @param url - URL to validate
 * @returns True if valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// Device/Browser Utilities
// ============================================

/**
 * Check if code is running on server
 * 
 * @returns True if server-side
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Check if code is running on client
 * 
 * @returns True if client-side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if user prefers reduced motion
 * 
 * @returns True if reduced motion preferred
 */
export function prefersReducedMotion(): boolean {
  if (isServer()) {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================
// Price Formatting
// ============================================

/**
 * Format price for display with currency symbol
 * 
 * Handles prices stored as cents (integers) to avoid floating-point errors.
 * GST is calculated separately at 9% Singapore rate.
 * 
 * @param price - Price in cents (integer)
 * @param options - Formatting options
 * @returns Formatted price string
 * 
 * @example
 * ```typescript
 * formatPrice(4900) // "S$49.00"
 * formatPrice(4900, { showCurrency: false }) // "49.00"
 * formatPrice(4900, { decimals: 0 }) // "S$49"
 * ```
 */
export function formatPrice(
  price: number | bigint | null | undefined,
  options: {
    currency?: string;
    locale?: string;
    decimals?: number;
    showCurrency?: boolean;
  } = {}
): string {
  const {
    currency = 'SGD',
    locale = 'en-SG',
    decimals = 2,
    showCurrency = true,
  } = options;

  // Handle null/undefined
  if (price === null || price === undefined) {
    return showCurrency ? 'S$0.00' : '0.00';
  }

  // Convert to number if bigint
  const numericPrice = typeof price === 'bigint' ? Number(price) : price;

  // Convert cents to dollars
  const amount = numericPrice / 100;

  if (!showCurrency) {
    return amount.toFixed(decimals);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format price range (min - max)
 * 
 * @param minPrice - Minimum price in cents
 * @param maxPrice - Maximum price in cents
 * @returns Formatted range string
 * 
 * @example
 * ```typescript
 * formatPriceRange(4900, 9900) // "S$49.00 – S$99.00"
 * ```
 */
export function formatPriceRange(
  minPrice: number | null | undefined,
  maxPrice: number | null | undefined
): string {
  const min = formatPrice(minPrice);
  const max = formatPrice(maxPrice);

  if (min === max) {
    return min;
  }

  return `${min} – ${max}`;
}
