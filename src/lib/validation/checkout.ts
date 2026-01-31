/**
 * Checkout Validation Schemas
 * 
 * Zod schemas for checkout form validation.
 * PDPA-compliant customer information collection.
 */

import { z } from 'zod';

// ============================================
// Customer Info Schema
// ============================================

/**
 * Customer information schema
 * Collects minimum required information for order processing
 */
export const customerInfoSchema = z.object({
  /** Customer email for order confirmation */
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  /** Customer first name */
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens and apostrophes'),

  /** Customer last name */
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens and apostrophes'),

  /** Phone number for delivery/contact */
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^[689]\d{7}$/,
      'Please enter a valid Singapore phone number (8 digits starting with 6, 8, or 9)'
    ),

  /** Marketing consent - explicit opt-in */
  marketingConsent: z.boolean(),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;

// ============================================
// Checkout Schema
// ============================================

/**
 * Complete checkout schema
 * Combines customer info with cart validation
 */
export const checkoutSchema = z.object({
  customer: customerInfoSchema,
  
  /** Cart items - validated server-side */
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1).max(10),
  })).min(1, 'Cart cannot be empty'),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;

// ============================================
// Order Lookup Schema
// ============================================

/**
 * Order lookup schema for guest users
 */
export const orderLookupSchema = z.object({
  /** Order number (format: ORD-YYYYMMDD-XXXX) */
  orderNumber: z
    .string()
    .min(1, 'Order number is required')
    .regex(
      /^ORD-\d{8}-[A-Z0-9]{4}$/,
      'Please enter a valid order number (e.g., ORD-20260131-ABCD)'
    ),

  /** Email used for the order */
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export type OrderLookup = z.infer<typeof orderLookupSchema>;

// ============================================
// Helper Functions
// ============================================

/**
 * Format phone number for display
 * Adds spaces for readability: 91234567 → 9123 4567
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return cleaned;
}

/**
 * Validate Singapore phone number
 */
export function isValidSingaporePhone(phone: string): boolean {
  return /^[689]\d{7}$/.test(phone.replace(/\D/g, ''));
}
