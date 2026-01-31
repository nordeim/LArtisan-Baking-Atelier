/**
 * GST Calculator Module
 * 
 * Singapore GST 9% calculation with DECIMAL(10,4) precision.
 * Uses integer arithmetic (cents) to prevent floating-point errors.
 * 
 * @see https://www.iras.gov.sg/taxes/goods-services-tax-(gst)
 */

/**
 * Pricing breakdown with GST calculation
 */
export interface PricingBreakdown {
  /** Subtotal in cents (before GST) */
  subtotal: number;
  /** GST amount in cents */
  gstAmount: number;
  /** GST rate as decimal (0.09 for 9%) */
  gstRate: number;
  /** Total in cents (subtotal + GST) */
  total: number;
}

/**
 * Singapore GST rate (9% as of 2024)
 */
export const SINGAPORE_GST_RATE = 0.09;

/**
 * Calculate GST breakdown for a given amount
 * 
 * Uses integer arithmetic to prevent floating-point errors.
 * All monetary values are handled in cents (integer).
 * 
 * @param amountInCents - Amount in cents (e.g., 1099 for $10.99)
 * @param gstRate - GST rate as decimal (default: 0.09 for 9%)
 * @returns PricingBreakdown with subtotal, GST, and total
 * 
 * @example
 * ```typescript
 * calculateGST(1000) // $10.00
 * // Returns: { subtotal: 1000, gstAmount: 90, gstRate: 0.09, total: 1090 }
 * ```
 */
export function calculateGST(
  amountInCents: number,
  gstRate: number = SINGAPORE_GST_RATE
): PricingBreakdown {
  // Ensure we're working with integers
  const subtotal = Math.round(amountInCents);
  
  // Calculate GST amount, rounded to nearest cent
  const gstAmount = Math.round(subtotal * gstRate);
  
  // Total is subtotal plus GST
  const total = subtotal + gstAmount;
  
  return {
    subtotal,
    gstAmount,
    gstRate,
    total,
  };
}

/**
 * Calculate total for a line item including GST
 * 
 * @param unitPriceCents - Unit price in cents
 * @param quantity - Number of items
 * @param gstRate - GST rate as decimal
 * @returns Total amount in cents (including GST)
 */
export function calculateLineItemTotal(
  unitPriceCents: number,
  quantity: number,
  gstRate: number = SINGAPORE_GST_RATE
): number {
  const subtotal = unitPriceCents * quantity;
  const gstAmount = Math.round(subtotal * gstRate);
  return subtotal + gstAmount;
}

/**
 * Calculate order totals from multiple line items
 * 
 * @param items - Array of { unitPriceCents, quantity, gstRate }
 * @returns Aggregated PricingBreakdown
 */
export function calculateOrderTotals(
  items: Array<{
    unitPriceCents: number;
    quantity: number;
    gstRate?: number;
  }>
): PricingBreakdown {
  let subtotal = 0;
  let gstAmount = 0;
  
  for (const item of items) {
    const rate = item.gstRate ?? SINGAPORE_GST_RATE;
    const itemSubtotal = item.unitPriceCents * item.quantity;
    const itemGST = Math.round(itemSubtotal * rate);
    
    subtotal += itemSubtotal;
    gstAmount += itemGST;
  }
  
  return {
    subtotal,
    gstAmount,
    gstRate: SINGAPORE_GST_RATE,
    total: subtotal + gstAmount,
  };
}

/**
 * Format cents to Singapore Dollar currency string
 * 
 * @param cents - Amount in cents
 * @returns Formatted string (e.g., "$10.90" or "$1,234.56")
 * 
 * @example
 * ```typescript
 * formatPrice(1090) // "$10.90"
 * formatPrice(100000) // "$1,000.00"
 * ```
 */
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Convert dollars to cents (integer)
 * 
 * @param dollars - Amount in dollars (can have decimals)
 * @returns Amount in cents (integer)
 * 
 * @example
 * ```typescript
 * priceToCents(10.99) // 1099
 * priceToCents(100) // 10000
 * ```
 */
export function priceToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 * 
 * @param cents - Amount in cents
 * @returns Amount in dollars
 * 
 * @example
 * ```typescript
 * centsToDollars(1099) // 10.99
 * centsToDollars(10000) // 100
 * ```
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Check if a price is valid (non-negative, not NaN, not Infinity)
 * 
 * @param cents - Amount in cents
 * @returns True if valid
 */
export function isValidPrice(cents: number): boolean {
  return (
    Number.isFinite(cents) &&
    !Number.isNaN(cents) &&
    cents >= 0 &&
    Number.isInteger(cents)
  );
}

/**
 * Add GST to a price and return formatted string
 * 
 * Convenience function for display purposes
 * 
 * @param cents - Amount in cents (without GST)
 * @param gstRate - GST rate (default: 9%)
 * @returns Formatted total price with GST
 */
export function formatPriceWithGST(
  cents: number,
  gstRate: number = SINGAPORE_GST_RATE
): string {
  const breakdown = calculateGST(cents, gstRate);
  return formatPrice(breakdown.total);
}

/**
 * Extract GST amount from a total price (inclusive calculation)
 * 
 * When you have a GST-inclusive price and need to extract the GST amount:
 * GST = Total - (Total / (1 + GST_Rate))
 * 
 * @param totalInCents - Total price including GST
 * @param gstRate - GST rate (default: 9%)
 * @returns Object with base amount and GST amount
 */
export function extractGSTFromTotal(
  totalInCents: number,
  gstRate: number = SINGAPORE_GST_RATE
): { baseAmount: number; gstAmount: number } {
  // base = total / (1 + rate)
  const baseAmount = Math.round(totalInCents / (1 + gstRate));
  const gstAmount = totalInCents - baseAmount;
  
  return {
    baseAmount,
    gstAmount,
  };
}

/**
 * Calculate savings amount and percentage
 * 
 * @param originalPriceCents - Original price in cents
 * @param salePriceCents - Sale price in cents
 * @returns Savings information
 */
export function calculateSavings(
  originalPriceCents: number,
  salePriceCents: number
): { amount: number; percentage: number } | null {
  if (salePriceCents >= originalPriceCents) {
    return null;
  }
  
  const amount = originalPriceCents - salePriceCents;
  const percentage = Math.round((amount / originalPriceCents) * 100);
  
  return {
    amount,
    percentage,
  };
}
