/**
 * Cart Type Definitions
 * 
 * TypeScript types for cart state, items, and operations.
 */



// ============================================
// Cart Item Types
// ============================================

/**
 * Cart item representing a product in the cart
 */
export interface CartItem {
  /** Unique product ID */
  id: string;
  /** Product name */
  name: string;
  /** Product slug for URL generation */
  slug: string;
  /** Product price in cents (integer) */
  price: number;
  /** Original price before discount (cents) */
  compareAtPrice?: number | null;
  /** Product image URL */
  image: string;
  /** Quantity in cart */
  quantity: number;
  /** Product category name */
  categoryName?: string | null;
  /** Stock quantity available */
  stockQuantity: number;
  /** Whether product is available for purchase */
  isAvailable: boolean;
  /** GST rate applied (e.g., 0.09 for 9%) */
  gstRate: number;
}

// ============================================
// Cart State Types
// ============================================

/**
 * Cart totals calculated from items
 */
export interface CartTotals {
  /** Sum of all item prices * quantities (cents) */
  subtotal: number;
  /** GST amount (cents) */
  gstAmount: number;
  /** Final total including GST (cents) */
  total: number;
  /** Total number of items (sum of quantities) */
  itemCount: number;
  /** Number of unique products */
  uniqueItemCount: number;
}

/**
 * Complete cart state
 */
export interface CartState {
  /** Cart items array */
  items: CartItem[];
  /** Calculated totals */
  totals: CartTotals;
  /** Last updated timestamp */
  lastUpdated: number;
  /** Whether cart is currently loading/persisting */
  isLoading: boolean;
}

// ============================================
// Cart Operation Types
// ============================================

/**
 * Action to add item to cart
 */
export interface AddToCartAction {
  type: 'ADD_ITEM';
  payload: {
    item: Omit<CartItem, 'quantity'>;
    quantity?: number;
  };
}

/**
 * Action to remove item from cart
 */
export interface RemoveFromCartAction {
  type: 'REMOVE_ITEM';
  payload: {
    id: string;
  };
}

/**
 * Action to update item quantity
 */
export interface UpdateQuantityAction {
  type: 'UPDATE_QUANTITY';
  payload: {
    id: string;
    quantity: number;
  };
}

/**
 * Action to clear entire cart
 */
export interface ClearCartAction {
  type: 'CLEAR_CART';
}

/**
 * Action to replace entire cart (e.g., from localStorage)
 */
export interface SetCartAction {
  type: 'SET_CART';
  payload: {
    items: CartItem[];
  };
}

/**
 * Action to set loading state
 */
export interface SetLoadingAction {
  type: 'SET_LOADING';
  payload: {
    isLoading: boolean;
  };
}

/**
 * Union type of all cart actions
 */
export type CartAction =
  | AddToCartAction
  | RemoveFromCartAction
  | UpdateQuantityAction
  | ClearCartAction
  | SetCartAction
  | SetLoadingAction;

// ============================================
// Cart Context Types
// ============================================

/**
 * Cart context value exposed to consumers
 */
export interface CartContextValue extends CartState {
  /** Add item to cart */
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  /** Remove item from cart */
  removeItem: (id: string) => void;
  /** Update item quantity */
  updateQuantity: (id: string, quantity: number) => void;
  /** Clear entire cart */
  clearCart: () => void;
  /** Check if item is in cart */
  hasItem: (id: string) => boolean;
  /** Get quantity of specific item */
  getItemQuantity: (id: string) => number;
  /** Check if cart has sufficient stock for all items */
  validateStock: () => { valid: boolean; errors: string[] };
}

// ============================================
// Storage Types
// ============================================

/**
 * Cart data stored in localStorage
 */
export interface PersistedCart {
  /** Cart items */
  items: CartItem[];
  /** Timestamp of last update */
  lastUpdated: number;
  /** Version for migration handling */
  version: number;
}

// ============================================
// Error Types
// ============================================

/**
 * Cart operation error
 */
export interface CartError {
  /** Error code */
  code: 'INSUFFICIENT_STOCK' | 'PRODUCT_UNAVAILABLE' | 'INVALID_QUANTITY' | 'CART_FULL';
  /** Error message */
  message: string;
  /** Product ID if applicable */
  productId?: string;
}

// ============================================
// Constants
// ============================================

/** Maximum items allowed in cart */
export const MAX_CART_ITEMS = 50;

/** Maximum quantity per product */
export const MAX_QUANTITY_PER_PRODUCT = 10;

/** localStorage key for cart persistence */
export const CART_STORAGE_KEY = 'lartisan-cart';

/** Cart state version for migrations */
export const CART_VERSION = 1;

/** Cart expiration time in milliseconds (30 minutes) */
export const CART_EXPIRATION_MS = 30 * 60 * 1000;
