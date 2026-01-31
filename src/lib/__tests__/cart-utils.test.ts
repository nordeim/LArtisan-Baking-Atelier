/**
 * Cart Utilities Tests
 * 
 * Comprehensive unit tests for cart calculation and operation functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CartItem } from '../../types/cart';
import {
  calculateCartTotals,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  hasItemInCart,
  getItemQuantity,
  validateCartStock,
  saveCartToStorage,
  loadCartFromStorage,
  clearCartFromStorage,
  isStorageAvailable,
} from '../cart-utils';
import { CART_STORAGE_KEY, MAX_CART_ITEMS, MAX_QUANTITY_PER_PRODUCT } from '../../types/cart';

// ============================================
// Test Data
// ============================================

const mockItem: Omit<CartItem, 'quantity'> = {
  id: 'prod-1',
  name: 'Sourdough Masterclass',
  slug: 'sourdough-masterclass',
  price: 4900, // $49.00 in cents (GST-inclusive)
  compareAtPrice: 6900,
  image: '/images/sourdough.jpg',
  categoryName: 'Bread',
  stockQuantity: 15, // Higher than MAX_QUANTITY_PER_PRODUCT for testing
  isAvailable: true,
  gstRate: 0.09,
};

const mockItem2: Omit<CartItem, 'quantity'> = {
  id: 'prod-2',
  name: 'Croissant Workshop',
  slug: 'croissant-workshop',
  price: 3900, // $39.00 in cents (GST-inclusive)
  image: '/images/croissant.jpg',
  categoryName: 'Pastry',
  stockQuantity: 15,
  isAvailable: true,
  gstRate: 0.09,
};

// ============================================
// Calculation Tests
// ============================================

describe('calculateCartTotals', () => {
  it('should calculate totals for empty cart', () => {
    const totals = calculateCartTotals([]);
    expect(totals).toEqual({
      subtotal: 0,
      gstAmount: 0,
      total: 0,
      itemCount: 0,
      uniqueItemCount: 0,
    });
  });

  it('should calculate totals for single item', () => {
    const items: CartItem[] = [{ ...mockItem, quantity: 1 }];
    const totals = calculateCartTotals(items);
    
    // Price $49.00 is GST-inclusive
    // Subtotal = $49.00 / 1.09 = $44.95 (4495 cents)
    // GST = $49.00 - $44.95 = $4.05 (405 cents)
    // Total = $49.00 (4900 cents)
    expect(totals.subtotal).toBeGreaterThan(0);
    expect(totals.gstAmount).toBeGreaterThan(0);
    expect(totals.total).toBe(4900); // Total equals sum of prices (GST-inclusive)
    expect(totals.itemCount).toBe(1);
    expect(totals.uniqueItemCount).toBe(1);
  });

  it('should calculate totals for multiple items with quantities', () => {
    const items: CartItem[] = [
      { ...mockItem, quantity: 2 }, // 2 x $49 = $98
      { ...mockItem2, quantity: 1 }, // 1 x $39 = $39
    ];
    const totals = calculateCartTotals(items);
    
    expect(totals.itemCount).toBe(3);
    expect(totals.uniqueItemCount).toBe(2);
    expect(totals.total).toBe(13700); // $98 + $39 = $137 (GST-inclusive prices)
  });

  it('should calculate GST correctly at 9%', () => {
    const items: CartItem[] = [{ ...mockItem, quantity: 1 }];
    const totals = calculateCartTotals(items);
    
    // Total = subtotal + GST
    expect(totals.total).toBe(totals.subtotal + totals.gstAmount);
    
    // GST should be approximately 9% of subtotal
    const gstRate = totals.gstAmount / totals.subtotal;
    expect(gstRate).toBeCloseTo(0.09, 2);
  });
});

// ============================================
// Add Item Tests
// ============================================

describe('addItemToCart', () => {
  it('should add new item to empty cart', () => {
    const items = addItemToCart([], mockItem, 1);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ ...mockItem, quantity: 1 });
  });

  it('should add item with specified quantity', () => {
    const items = addItemToCart([], mockItem, 3);
    expect(items[0]?.quantity).toBe(3);
  });

  it('should increase quantity for existing item', () => {
    const items1 = addItemToCart([], mockItem, 1);
    const items2 = addItemToCart(items1, mockItem, 2);
    
    expect(items2).toHaveLength(1);
    expect(items2[0]?.quantity).toBe(3);
  });

  it('should throw error for unavailable product', () => {
    const unavailableItem = { ...mockItem, isAvailable: false };
    expect(() => addItemToCart([], unavailableItem, 1)).toThrow('unavailable');
  });

  it('should throw error for quantity less than 1', () => {
    expect(() => addItemToCart([], mockItem, 0)).toThrow('at least 1');
    expect(() => addItemToCart([], mockItem, -1)).toThrow('at least 1');
  });

  it('should throw error for quantity exceeding max per product', () => {
    expect(() => addItemToCart([], mockItem, MAX_QUANTITY_PER_PRODUCT + 1)).toThrow('Maximum quantity');
  });

  it('should throw error for insufficient stock', () => {
    // Use a quantity higher than stock (8) but below MAX_QUANTITY_PER_PRODUCT (10)
    const lowStockItem = { ...mockItem, stockQuantity: 5 };
    expect(() => addItemToCart([], lowStockItem, 6)).toThrow('stock');
  });

  it('should throw error when adding would exceed max cart items', () => {
    const fullCart = Array.from({ length: MAX_CART_ITEMS }, (_, i) => ({
      ...mockItem,
      id: `prod-${i}`,
      quantity: 1,
    }));
    
    expect(() => addItemToCart(fullCart, { ...mockItem, id: 'new-item' }, 1)).toThrow('maximum');
  });

  it('should throw error when combined quantity exceeds stock', () => {
    const lowStockItem = { ...mockItem, stockQuantity: 8 };
    const items = addItemToCart([], lowStockItem, 5);
    expect(() => addItemToCart(items, lowStockItem, 4)).toThrow('stock');
  });
});

// ============================================
// Remove Item Tests
// ============================================

describe('removeItemFromCart', () => {
  it('should remove item from cart', () => {
    const items = [
      { ...mockItem, quantity: 1 },
      { ...mockItem2, quantity: 1 },
    ];
    const result = removeItemFromCart(items, mockItem.id);
    
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(mockItem2.id);
  });

  it('should return same array if item not found', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    const result = removeItemFromCart(items, 'non-existent');
    
    expect(result).toHaveLength(1);
    expect(result).toEqual(items);
  });

  it('should handle empty cart', () => {
    const result = removeItemFromCart([], 'any-id');
    expect(result).toHaveLength(0);
  });
});

// ============================================
// Update Quantity Tests
// ============================================

describe('updateItemQuantity', () => {
  it('should update item quantity', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    const result = updateItemQuantity(items, mockItem.id, 5);
    
    expect(result[0]?.quantity).toBe(5);
  });

  it('should remove item when quantity is 0', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    const result = updateItemQuantity(items, mockItem.id, 0);
    
    expect(result).toHaveLength(0);
  });

  it('should remove item when quantity is negative', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    const result = updateItemQuantity(items, mockItem.id, -1);
    
    expect(result).toHaveLength(0);
  });

  it('should throw error for quantity exceeding max', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    expect(() => updateItemQuantity(items, mockItem.id, MAX_QUANTITY_PER_PRODUCT + 1)).toThrow('Maximum quantity');
  });

  it('should throw error for insufficient stock', () => {
    const lowStockItem = { ...mockItem, stockQuantity: 5 };
    const items = [{ ...lowStockItem, quantity: 1 }];
    expect(() => updateItemQuantity(items, lowStockItem.id, 6)).toThrow('stock');
  });

  it('should return same array if item not found', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    const result = updateItemQuantity(items, 'non-existent', 2);
    
    expect(result).toEqual(items);
  });
});

// ============================================
// Query Tests
// ============================================

describe('hasItemInCart', () => {
  it('should return true for existing item', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    expect(hasItemInCart(items, mockItem.id)).toBe(true);
  });

  it('should return false for non-existing item', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    expect(hasItemInCart(items, 'non-existent')).toBe(false);
  });

  it('should return false for empty cart', () => {
    expect(hasItemInCart([], 'any-id')).toBe(false);
  });
});

describe('getItemQuantity', () => {
  it('should return quantity for existing item', () => {
    const items = [{ ...mockItem, quantity: 5 }];
    expect(getItemQuantity(items, mockItem.id)).toBe(5);
  });

  it('should return 0 for non-existing item', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    expect(getItemQuantity(items, 'non-existent')).toBe(0);
  });

  it('should return 0 for empty cart', () => {
    expect(getItemQuantity([], 'any-id')).toBe(0);
  });
});

// ============================================
// Validation Tests
// ============================================

describe('validateCartStock', () => {
  it('should return valid for cart with sufficient stock', () => {
    const items = [
      { ...mockItem, quantity: 1 },
      { ...mockItem2, quantity: 1 },
    ];
    const result = validateCartStock(items);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for unavailable product', () => {
    const items = [{ ...mockItem, quantity: 1, isAvailable: false }];
    const result = validateCartStock(items);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('no longer available');
  });

  it('should return invalid for insufficient stock', () => {
    const items = [{ ...mockItem, quantity: mockItem.stockQuantity + 1 }];
    const result = validateCartStock(items);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Only');
  });

  it('should return multiple errors for multiple issues', () => {
    const items = [
      { ...mockItem, quantity: 1, isAvailable: false },
      { ...mockItem2, quantity: mockItem2.stockQuantity + 1 },
    ];
    const result = validateCartStock(items);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});

// ============================================
// Storage Tests
// ============================================

describe('Storage Functions', () => {
  let localStorageMock: Storage;

  beforeEach(() => {
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      localStorageMock.setItem = vi.fn();
      localStorageMock.removeItem = vi.fn();
      expect(isStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage throws', () => {
      localStorageMock.setItem = vi.fn(() => {
        throw new Error('Storage disabled');
      });
      expect(isStorageAvailable()).toBe(false);
    });
  });

  describe('saveCartToStorage', () => {
    it('should save cart to localStorage', () => {
      const items = [{ ...mockItem, quantity: 1 }];
      saveCartToStorage(items);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        CART_STORAGE_KEY,
        expect.stringContaining(mockItem.id)
      );
    });

    it('should return false if storage is not available', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });
      
      const result = saveCartToStorage([{ ...mockItem, quantity: 1 }]);
      expect(result).toBe(false);
    });
  });

  describe('loadCartFromStorage', () => {
    it('should load cart from localStorage', () => {
      const storedData = {
        items: [{ ...mockItem, quantity: 1 }],
        lastUpdated: Date.now(),
        version: 1,
      };
      localStorageMock.getItem = vi.fn(() => JSON.stringify(storedData));
      
      const result = loadCartFromStorage();
      expect(result).toEqual(storedData.items);
    });

    it('should return null if no stored cart', () => {
      localStorageMock.getItem = vi.fn(() => null);
      const result = loadCartFromStorage();
      expect(result).toBeNull();
    });

    it('should return null for expired cart', () => {
      const expiredData = {
        items: [{ ...mockItem, quantity: 1 }],
        lastUpdated: Date.now() - 31 * 60 * 1000, // 31 minutes ago
        version: 1,
      };
      localStorageMock.getItem = vi.fn(() => JSON.stringify(expiredData));
      
      const result = loadCartFromStorage();
      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(CART_STORAGE_KEY);
    });

    it('should return null for invalid JSON', () => {
      localStorageMock.getItem = vi.fn(() => 'invalid json');
      const result = loadCartFromStorage();
      expect(result).toBeNull();
    });
  });

  describe('clearCartFromStorage', () => {
    it('should remove cart from localStorage', () => {
      clearCartFromStorage();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(CART_STORAGE_KEY);
    });
  });
});
