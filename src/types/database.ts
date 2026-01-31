/**
 * Database Type Exports
 * 
 * Re-exports Prisma-generated types and provides utility types
 * for common query patterns with relations included.
 */

import type { Decimal } from '@prisma/client/runtime/library';

// ============================================
// Model Types (re-exported from Prisma)
// ============================================

export type {
  User,
  Account,
  Session,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
} from '@prisma/client';

// ============================================
// Enum Types (re-exported from Prisma)
// ============================================

export {
  UserRole,
  OrderStatus,
  PaymentStatus,
} from '@prisma/client';

// ============================================
// Utility Types with Relations
// ============================================

import type {
  User as UserBase,
  Category as CategoryBase,
  Product as ProductBase,
  Order as OrderBase,
  OrderItem as OrderItemBase,
  Review as ReviewBase,
} from '@prisma/client';

/**
 * Category with products count
 */
export type CategoryWithProductCount = CategoryBase & {
  _count?: {
    products: number;
  };
};

/**
 * Product with category relation
 */
export type ProductWithCategory = ProductBase & {
  category: CategoryBase | null;
};

/**
 * Product with reviews and average rating
 */
export type ProductWithReviews = ProductBase & {
  category: CategoryBase | null;
  reviews: ReviewBase[];
  _count?: {
    reviews: number;
  };
  averageRating?: number;
};

/**
 * Order item with product relation
 */
export type OrderItemWithProduct = OrderItemBase & {
  product: ProductBase;
};

/**
 * Order with items and user
 */
export type OrderWithItems = OrderBase & {
  user: UserBase | null;
  orderItems: OrderItemWithProduct[];
};

/**
 * Order with minimal relations (for list views)
 */
export type OrderSummary = OrderBase & {
  user: Pick<UserBase, 'id' | 'email' | 'name'> | null;
  _count?: {
    orderItems: number;
  };
};

/**
 * User with orders (for admin views)
 */
export type UserWithOrders = UserBase & {
  orders: OrderSummary[];
  _count?: {
    orders: number;
    reviews: number;
  };
};

/**
 * Review with user and product
 */
export type ReviewWithRelations = ReviewBase & {
  user: Pick<UserBase, 'id' | 'name'>;
  product: Pick<ProductBase, 'id' | 'name' | 'slug'>;
};

// ============================================
// Input Types for Forms/APIs
// ============================================

/**
 * Address format for orders
 */
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Cart item structure
 */
export interface CartItem {
  productId: string;
  quantity: number;
}

/**
 * Product filter options
 */
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  search?: string;
}

// ============================================
// Financial Types
// ============================================

/**
 * Pricing breakdown with GST calculation
 */
export interface PricingBreakdown {
  subtotal: number;   // in cents
  gstAmount: number;  // in cents
  gstRate: number;    // as decimal (0.09 for 9%)
  shippingCost: number; // in cents
  discountAmount: number; // in cents
  total: number;      // in cents
}

/**
 * Order item input for creating orders
 */
export interface OrderItemInput {
  productId: string;
  quantity: number;
}

// ============================================
// Helper Types
// ============================================

/**
 * Type for Prisma Decimal conversion
 */
export type DecimalValue = Decimal | number | string;

/**
 * Safe user type (without password)
 */
export type SafeUser = Omit<UserBase, 'hashedPassword'>;

/**
 * Safe user with orders
 */
export type SafeUserWithOrders = SafeUser & {
  orders: OrderSummary[];
};
