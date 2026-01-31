/**
 * Cart Utilities
 * 
 * Pure functions for cart calculations and operations.
 * All prices are in cents (integers) to avoid floating-point errors.
 */

import type {
  CartItem,
  CartTotals,
  CartError,
  PersistedCart,
} from '../types/cart';
import {
  MAX_CART_ITEMS,
  MAX_QUANTITY_PER_PRODUCT,
  CART_STORAGE_KEY,
  CART_VERSION,
  CART_EXPIRATION_MS,
} from '../types/cart';

// ============================================
// Calculation Functions
// ============================================

/**
 * Calculate cart totals from items
 * 
 * @param items - Cart items
 * @returns Calculated totals
 */
export function calculateCartTotals(items: CartItem[]): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItemCount = items.length;

  // Calculate total from GST-inclusive prices
  const total = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Calculate GST-exclusive subtotal (remove GST from total)
  // subtotal = total / (1 + GST_RATE)
  const GST_RATE = 0.09;
  const subtotal = Math.round(total / (1 + GST_RATE));
  const gstAmount = total - subtotal;

  return {
    subtotal,
    gstAmount,
    total,
    itemCount,
    uniqueItemCount,
  };
}

/**
 * Calculate cart totals with custom GST rate
 * 
 * @param items - Cart items
 * @param gstRate - GST rate (e.g., 0.09 for 9%)
 * @returns Calculated totals
 */
export function calculateCartTotalsWithRate(
  items: CartItem[],
  gstRate: number
): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItemCount = items.length;

  const total = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Calculate GST-exclusive subtotal (remove GST from total)
  const subtotal = Math.round(total / (1 + gstRate));
  const gstAmount = total - subtotal;

  return {
    subtotal,
    gstAmount,
    total,
    itemCount,
    uniqueItemCount,
  };
}

// ============================================
// Item Operation Functions
// ============================================

/**
 * Add item to cart items array
 * 
 * @param items - Current cart items
 * @param newItem - Item to add (without quantity)
 * @param quantity - Quantity to add (default: 1)
 * @returns Updated items array
 * @throws CartError if validation fails
 */
export function addItemToCart(
  items: CartItem[],
  newItem: Omit<CartItem, 'quantity'>,
  quantity: number = 1
): CartItem[] {
  // Validate quantity
  if (quantity < 1) {
    const error: CartError = {
      code: 'INVALID_QUANTITY',
      message: 'Quantity must be at least 1',
    };
    throw error;
  }

  if (quantity > MAX_QUANTITY_PER_PRODUCT) {
    const error: CartError = {
      code: 'INVALID_QUANTITY',
      message: `Maximum quantity per product is ${MAX_QUANTITY_PER_PRODUCT}`,
      productId: newItem.id,
    };
    throw error;
  }

  // Check product availability
  if (!newItem.isAvailable) {
    const error: CartError = {
      code: 'PRODUCT_UNAVAILABLE',
      message: 'This product is currently unavailable',
      productId: newItem.id,
    };
    throw error;
  }

  // Check if item already exists
  const existingItemIndex = items.findIndex((item) => item.id === newItem.id);

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    const existingItem = items[existingItemIndex]!;
    const newQuantity = existingItem.quantity + quantity;

    // Check max quantity limit
    if (newQuantity > MAX_QUANTITY_PER_PRODUCT) {
      const error: CartError = {
        code: 'INVALID_QUANTITY',
        message: `Maximum quantity per product is ${MAX_QUANTITY_PER_PRODUCT}`,
        productId: newItem.id,
      };
      throw error;
    }

    // Check stock availability
    if (newQuantity > existingItem.stockQuantity) {
      const error: CartError = {
        code: 'INSUFFICIENT_STOCK',
        message: `Only ${existingItem.stockQuantity} items available in stock`,
        productId: newItem.id,
      };
      throw error;
    }

    const updatedItems = [...items];
    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: newQuantity,
    };
    return updatedItems;
  }

  // Check cart capacity
  if (items.length >= MAX_CART_ITEMS) {
    const error: CartError = {
      code: 'CART_FULL',
      message: `Cart can contain maximum ${MAX_CART_ITEMS} unique products`,
    };
    throw error;
  }

  // Check stock for new item
  if (quantity > newItem.stockQuantity) {
    const error: CartError = {
      code: 'INSUFFICIENT_STOCK',
      message: `Only ${newItem.stockQuantity} items available in stock`,
      productId: newItem.id,
    };
    throw error;
  }

  // Add new item
  return [...items, { ...newItem, quantity }];
}

/**
 * Remove item from cart
 * 
 * @param items - Current cart items
 * @param id - Product ID to remove
 * @returns Updated items array
 */
export function removeItemFromCart(items: CartItem[], id: string): CartItem[] {
  return items.filter((item) => item.id !== id);
}

/**
 * Update item quantity
 * 
 * @param items - Current cart items
 * @param id - Product ID to update
 * @param quantity - New quantity
 * @returns Updated items array
 * @throws CartError if validation fails
 */
export function updateItemQuantity(
  items: CartItem[],
  id: string,
  quantity: number
): CartItem[] {
  if (quantity < 1) {
    // Remove item if quantity is less than 1
    return removeItemFromCart(items, id);
  }

  if (quantity > MAX_QUANTITY_PER_PRODUCT) {
    const error: CartError = {
      code: 'INVALID_QUANTITY',
      message: `Maximum quantity per product is ${MAX_QUANTITY_PER_PRODUCT}`,
      productId: id,
    };
    throw error;
  }

  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return items;
  }

  const item = items[itemIndex]!;

  if (quantity > item.stockQuantity) {
    const error: CartError = {
      code: 'INSUFFICIENT_STOCK',
      message: `Only ${item.stockQuantity} items available in stock`,
      productId: id,
    };
    throw error;
  }

  const updatedItems = [...items];
  updatedItems[itemIndex] = { ...item, quantity };
  return updatedItems;
}

// ============================================
// Query Functions
// ============================================

/**
 * Check if cart has item
 * 
 * @param items - Cart items
 * @param id - Product ID to check
 * @returns True if item exists
 */
export function hasItemInCart(items: CartItem[], id: string): boolean {
  return items.some((item) => item.id === id);
}

/**
 * Get item quantity from cart
 * 
 * @param items - Cart items
 * @param id - Product ID
 * @returns Quantity (0 if not found)
 */
export function getItemQuantity(items: CartItem[], id: string): number {
  const item = items.find((item) => item.id === id);
  return item?.quantity ?? 0;
}

/**
 * Validate cart stock availability
 * 
 * @param items - Cart items
 * @returns Validation result with errors
 */
export function validateCartStock(
  items: CartItem[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const item of items) {
    if (!item.isAvailable) {
      errors.push(`${item.name} is no longer available`);
    } else if (item.quantity > item.stockQuantity) {
      errors.push(
        `${item.name}: Only ${item.stockQuantity} available (you have ${item.quantity})`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// Persistence Functions
// ============================================

/**
 * Check if localStorage is available
 * 
 * @returns True if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save cart to localStorage
 * 
 * @param items - Cart items to save
 * @returns True if saved successfully
 */
export function saveCartToStorage(items: CartItem[]): boolean {
  if (!isStorageAvailable()) return false;

  try {
    const data: PersistedCart = {
      items,
      lastUpdated: Date.now(),
      version: CART_VERSION,
    };
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save cart:', error);
    return false;
  }
}

/**
 * Load cart from localStorage
 * 
 * @returns Cart items or null if not found/expired
 */
export function loadCartFromStorage(): CartItem[] | null {
  if (!isStorageAvailable()) return null;

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return null;

    const data: PersistedCart = JSON.parse(stored);

    // Check version for migrations
    if (data.version !== CART_VERSION) {
      // Handle migration if needed
      console.warn(`Cart version mismatch: ${data.version} vs ${CART_VERSION}`);
    }

    // Check expiration
    if (Date.now() - data.lastUpdated > CART_EXPIRATION_MS) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }

    return data.items;
  } catch (error) {
    console.error('Failed to load cart:', error);
    return null;
  }
}

/**
 * Clear cart from localStorage
 */
export function clearCartFromStorage(): void {
  if (!isStorageAvailable()) return;

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
}

// ============================================
// Formatting Functions
// ============================================

/**
 * Format cart item for display
 * 
 * @param item - Cart item
 * @returns Formatted display object
 */
export function formatCartItem(item: CartItem) {
  return {
    ...item,
    displayPrice: (item.price / 100).toFixed(2),
    displayTotal: ((item.price * item.quantity) / 100).toFixed(2),
    hasDiscount: item.compareAtPrice && item.compareAtPrice > item.price,
    discountPercent: item.compareAtPrice
      ? Math.round((1 - item.price / item.compareAtPrice) * 100)
      : 0,
  };
}
