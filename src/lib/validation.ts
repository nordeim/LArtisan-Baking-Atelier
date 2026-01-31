/**
 * Validation Schemas
 * 
 * Zod schemas for type-safe input validation.
 * Provides custom error messages for better user experience.
 */

import { z } from 'zod';
// UserRole is available from @prisma/client when needed for role validation
// import { UserRole } from '@prisma/client';

// ============================================
// Helper Validators
// ============================================

/** CUID validator */
const cuidSchema = z.string().cuid();

/** Singapore phone number validator (8 digits) */
const singaporePhoneSchema = z
  .string()
  .regex(/^[0-9]{8}$/, 'Phone number must be 8 digits');

/** Singapore postal code validator (6 digits) */
const singaporePostalCodeSchema = z
  .string()
  .regex(/^[0-9]{6}$/, 'Postal code must be 6 digits');

// ============================================
// Address Schemas
// ============================================

/**
 * Singapore address schema
 * 
 * Validates Singapore address format with 6-digit postal code.
 */
export const addressSchema = z.object({
  line1: z
    .string()
    .min(1, 'Address line 1 is required')
    .max(100, 'Address line 1 must be less than 100 characters'),
  line2: z
    .string()
    .max(100, 'Address line 2 must be less than 100 characters')
    .optional(),
  city: z
    .string()
    .min(1, 'City is required')
    .max(50, 'City must be less than 50 characters'),
  postalCode: singaporePostalCodeSchema,
  country: z.literal('SG'),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ============================================
// Authentication Schemas
// ============================================

/**
 * Login schema
 * 
 * Validates email and password for login.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Registration schema
 * 
 * Validates user registration data with strong password requirements.
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;

// ============================================
// Checkout Schemas
// ============================================

/**
 * Checkout item schema
 */
export const checkoutItemSchema = z.object({
  productId: cuidSchema,
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than 0')
    .max(99, 'Maximum 99 items per product'),
});

export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;

/**
 * Checkout schema
 * 
 * Validates checkout form data.
 */
export const checkoutSchema = z.object({
  items: z
    .array(checkoutItemSchema)
    .min(1, 'At least one item is required')
    .max(50, 'Maximum 50 items per order'),
  shippingAddress: addressSchema,
  customerEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  customerName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  customerPhone: singaporePhoneSchema.optional(),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ============================================
// Product Schemas
// ============================================

/**
 * Product filter schema
 * 
 * Validates product listing filter parameters.
 */
export const productFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z
    .number()
    .positive('Minimum price must be positive')
    .optional(),
  maxPrice: z
    .number()
    .positive('Maximum price must be positive')
    .optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  search: z
    .string()
    .min(2, 'Search term must be at least 2 characters')
    .optional(),
  sortBy: z
    .enum(['price', 'name', 'createdAt', 'popularity'])
    .optional()
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(20),
});

export type ProductFilterInput = z.infer<typeof productFilterSchema>;

/**
 * Create product schema (Admin)
 */
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z
    .string()
    .max(500, 'Short description must be less than 500 characters')
    .optional(),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive('Compare at price must be positive').optional(),
  gstRate: z.number().min(0).max(1).default(0.09),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(50, 'SKU must be less than 50 characters'),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  images: z.array(z.string().url('Must be a valid URL')),
  weight: z.number().positive().optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isDigital: z.boolean().default(false),
  categoryId: cuidSchema.optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// ============================================
// Order Schemas
// ============================================

/**
 * Update order status schema (Admin)
 */
export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]),
  trackingNumber: z.string().optional(),
  internalNotes: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ============================================
// Review Schemas
// ============================================

/**
 * Create review schema
 */
export const createReviewSchema = z.object({
  productId: cuidSchema,
  orderId: cuidSchema.optional(),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  title: z
    .string()
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  comment: z
    .string()
    .max(2000, 'Review must be less than 2000 characters')
    .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// ============================================
// Cart Schemas
// ============================================

/**
 * Cart item schema
 */
export const cartItemSchema = z.object({
  productId: cuidSchema,
  quantity: z
    .number()
    .int()
    .positive()
    .max(99),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;

/**
 * Update cart schema
 */
export const updateCartSchema = z.object({
  items: z.array(cartItemSchema),
});

export type UpdateCartInput = z.infer<typeof updateCartSchema>;

// ============================================
// User Schemas (Admin)
// ============================================

/**
 * Update user role schema (Admin)
 */
export const updateUserRoleSchema = z.object({
  userId: cuidSchema,
  role: z.enum(['CUSTOMER', 'ADMIN', 'BAKER']),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

// ============================================
// Contact Form Schema
// ============================================

/**
 * Contact form schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ============================================
// Pagination Schema
// ============================================

/**
 * Pagination parameters schema
 */
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ============================================
// Utility Functions
// ============================================

/**
 * Safely parse and validate data
 * 
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Parsed data or null if invalid
 */
export function safeParse<T>(schema: z.ZodType<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Parse and throw on error
 * 
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Parsed data
 * @throws ZodError if invalid
 */
export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Get validation errors
 * 
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Object with field errors or null if valid
 */
export function getValidationErrors<T>(
  schema: z.ZodType<T>,
  data: unknown
): Record<string, string[]> | null {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return null;
  }
  
  const errors: Record<string, string[]> = {};
  
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  
  return errors;
}
