import { describe, it, expect } from 'vitest';
import {
  calculateGST,
  calculateLineItemTotal,
  calculateOrderTotals,
  formatPrice,
  priceToCents,
  centsToDollars,
  isValidPrice,
  formatPriceWithGST,
  extractGSTFromTotal,
  calculateSavings,
  SINGAPORE_GST_RATE,
} from '../gst-calculator';

describe('GST Calculator', () => {
  describe('calculateGST', () => {
    it('should calculate GST correctly for standard amount', () => {
      const result = calculateGST(1000); // $10.00
      expect(result.subtotal).toBe(1000);
      expect(result.gstAmount).toBe(90); // $0.90 GST
      expect(result.gstRate).toBe(0.09);
      expect(result.total).toBe(1090); // $10.90
    });

    it('should handle $0 amount', () => {
      const result = calculateGST(0);
      expect(result.subtotal).toBe(0);
      expect(result.gstAmount).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should handle large amounts', () => {
      const result = calculateGST(100000); // $1,000.00
      expect(result.subtotal).toBe(100000);
      expect(result.gstAmount).toBe(9000); // $90.00 GST
      expect(result.total).toBe(109000);
    });

    it('should round GST correctly', () => {
      // $3.33 * 0.09 = $0.2997 → rounds to $0.30
      const result = calculateGST(333);
      expect(result.gstAmount).toBe(30);
    });

    it('should use custom GST rate', () => {
      const result = calculateGST(1000, 0.08); // 8% GST
      expect(result.gstAmount).toBe(80);
      expect(result.total).toBe(1080);
    });

    it('should handle decimal amounts correctly', () => {
      const result = calculateGST(1099); // $10.99
      // $10.99 * 0.09 = $0.9891 → rounds to $0.99
      expect(result.gstAmount).toBe(99);
      expect(result.total).toBe(1198); // $11.98
    });

    it('should use default Singapore GST rate', () => {
      const result = calculateGST(1000);
      expect(result.gstRate).toBe(SINGAPORE_GST_RATE);
    });
  });

  describe('calculateLineItemTotal', () => {
    it('should calculate total for single item', () => {
      const total = calculateLineItemTotal(1000, 1); // $10.00 × 1
      expect(total).toBe(1090); // $10.90 with GST
    });

    it('should calculate total for multiple items', () => {
      const total = calculateLineItemTotal(450, 3); // $4.50 × 3 = $13.50
      // $13.50 * 0.09 = $1.215 → rounds to $1.22
      expect(total).toBe(1472); // $14.72
    });

    it('should handle zero quantity', () => {
      const total = calculateLineItemTotal(1000, 0);
      expect(total).toBe(0);
    });
  });

  describe('calculateOrderTotals', () => {
    it('should calculate totals for multiple line items', () => {
      const items = [
        { unitPriceCents: 1000, quantity: 1 }, // $10.00
        { unitPriceCents: 450, quantity: 2 },  // $9.00
      ];
      const result = calculateOrderTotals(items);
      
      // Subtotal: $19.00 = 1900 cents
      // GST: $19.00 * 0.09 = $1.71 = 171 cents
      // Total: $20.71 = 2071 cents
      expect(result.subtotal).toBe(1900);
      expect(result.gstAmount).toBe(171);
      expect(result.total).toBe(2071);
    });

    it('should handle empty items array', () => {
      const result = calculateOrderTotals([]);
      expect(result.subtotal).toBe(0);
      expect(result.gstAmount).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should respect custom GST rates per item', () => {
      const items = [
        { unitPriceCents: 1000, quantity: 1, gstRate: 0.09 },
        { unitPriceCents: 500, quantity: 1, gstRate: 0.08 },
      ];
      const result = calculateOrderTotals(items);
      
      // Item 1: $10.00 + $0.90 = $10.90
      // Item 2: $5.00 + $0.40 = $5.40
      // Total: $16.30
      expect(result.total).toBe(1630);
    });
  });

  describe('formatPrice', () => {
    it('should format cents to SGD currency string', () => {
      expect(formatPrice(1090)).toBe('$10.90');
    });

    it('should format zero cents', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should format large amounts with thousands separator', () => {
      expect(formatPrice(100000)).toBe('$1,000.00');
    });

    it('should format single cents correctly', () => {
      expect(formatPrice(1)).toBe('$0.01');
    });

    it('should format amounts with only dollars', () => {
      expect(formatPrice(1000)).toBe('$10.00');
    });
  });

  describe('priceToCents', () => {
    it('should convert dollars to cents', () => {
      expect(priceToCents(10.99)).toBe(1099);
    });

    it('should handle whole dollars', () => {
      expect(priceToCents(100)).toBe(10000);
    });

    it('should handle zero', () => {
      expect(priceToCents(0)).toBe(0);
    });

    it('should round correctly', () => {
      expect(priceToCents(10.999)).toBe(1100);
      expect(priceToCents(10.994)).toBe(1099);
    });
  });

  describe('centsToDollars', () => {
    it('should convert cents to dollars', () => {
      expect(centsToDollars(1099)).toBe(10.99);
    });

    it('should handle whole dollars', () => {
      expect(centsToDollars(10000)).toBe(100);
    });

    it('should handle zero', () => {
      expect(centsToDollars(0)).toBe(0);
    });

    it('should handle single cents', () => {
      expect(centsToDollars(1)).toBe(0.01);
    });
  });

  describe('isValidPrice', () => {
    it('should return true for valid positive integer', () => {
      expect(isValidPrice(1000)).toBe(true);
    });

    it('should return true for zero', () => {
      expect(isValidPrice(0)).toBe(true);
    });

    it('should return false for negative numbers', () => {
      expect(isValidPrice(-100)).toBe(false);
    });

    it('should return false for non-integers', () => {
      expect(isValidPrice(10.99)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(isValidPrice(NaN)).toBe(false);
    });

    it('should return false for Infinity', () => {
      expect(isValidPrice(Infinity)).toBe(false);
    });
  });

  describe('formatPriceWithGST', () => {
    it('should format price with GST added', () => {
      expect(formatPriceWithGST(1000)).toBe('$10.90');
    });

    it('should use custom GST rate', () => {
      expect(formatPriceWithGST(1000, 0.08)).toBe('$10.80');
    });
  });

  describe('extractGSTFromTotal', () => {
    it('should extract GST from GST-inclusive price', () => {
      const result = extractGSTFromTotal(1090); // $10.90 total (includes GST)
      // $10.90 / 1.09 = $10.00 base
      expect(result.baseAmount).toBe(1000);
      expect(result.gstAmount).toBe(90);
    });

    it('should handle zero', () => {
      const result = extractGSTFromTotal(0);
      expect(result.baseAmount).toBe(0);
      expect(result.gstAmount).toBe(0);
    });

    it('should round correctly', () => {
      const result = extractGSTFromTotal(1198); // $11.98
      expect(result.gstAmount + result.baseAmount).toBe(1198);
    });
  });

  describe('calculateSavings', () => {
    it('should calculate savings amount and percentage', () => {
      const result = calculateSavings(1000, 750); // $10.00 → $7.50
      expect(result).not.toBeNull();
      expect(result?.amount).toBe(250); // $2.50 savings
      expect(result?.percentage).toBe(25); // 25% off
    });

    it('should return null when no savings', () => {
      const result = calculateSavings(1000, 1000);
      expect(result).toBeNull();
    });

    it('should return null when sale price is higher', () => {
      const result = calculateSavings(1000, 1200);
      expect(result).toBeNull();
    });

    it('should calculate 50% off correctly', () => {
      const result = calculateSavings(1000, 500);
      expect(result?.percentage).toBe(50);
    });
  });

  describe('Precision Tests', () => {
    it('should not have floating point errors', () => {
      // Common floating point issue: 0.1 + 0.2 !== 0.3
      const result = calculateGST(10);
      expect(result.total).toBe(11); // 10 + 1 = 11, not 10.9999999
    });

    it('should handle many calculations consistently', () => {
      for (let cents = 1; cents <= 1000; cents++) {
        const result = calculateGST(cents);
        expect(result.subtotal + result.gstAmount).toBe(result.total);
      }
    });
  });
});
