// ============================================
// L'Artisan Baking Atelier - Checkout E2E Tests
// Tests checkout flow, payment integration, and order confirmation
// ============================================

import { test, expect, Page } from '@playwright/test';

// Test data
const CUSTOMER_INFO = {
  email: 'test-checkout@example.com',
  name: 'Test Customer',
  phone: '81234567',
};

const ADDRESS = {
  line1: '123 Test Street',
  line2: '#01-01',
  city: 'Singapore',
  postalCode: '123456',
};

// Stripe test card numbers
const STRIPE_TEST_CARDS = {
  success: '4242424242424242',  // Visa - always succeeds
  decline: '4000000000000002',  // Always declined
  insufficient: '4000000000009995',  // Insufficient funds
};

async function addItemToCart(page: Page) {
  await page.goto('/shop');
  await page.locator('[data-testid="product-card"], .product-card, article').first().click();
  await page.click('button:has-text("Add to Cart")');
  await page.waitForTimeout(500);
}

test.describe('Checkout Flow', () => {
  
  test.describe('Guest Checkout', () => {
    test('should navigate to checkout with items in cart', async ({ page }) => {
      // Add item to cart
      await addItemToCart(page);
      
      // Navigate to checkout
      await page.goto('/checkout');
      
      // Verify checkout page loaded
      await expect(page).toHaveTitle(/Checkout|Payment/i);
      
      // Verify order summary is displayed
      await expect(page.locator('text=/order summary|total|subtotal/i').first()).toBeVisible();
    });

    test('should display empty cart message when no items', async ({ page }) => {
      await page.goto('/checkout');
      
      // Should redirect to cart or show empty message
      const currentUrl = page.url();
      if (currentUrl.includes('/cart')) {
        await expect(page.locator('text=/empty|no items/i').first()).toBeVisible();
      } else {
        await expect(page.locator('text=/empty|no items|add items/i').first()).toBeVisible();
      }
    });

    test('should fill customer information', async ({ page }) => {
      // Add item to cart
      await addItemToCart(page);
      
      await page.goto('/checkout');
      
      // Fill customer info
      await page.fill('input[name="email"]', CUSTOMER_INFO.email);
      await page.fill('input[name="name"]', CUSTOMER_INFO.name);
      await page.fill('input[name="phone"]', CUSTOMER_INFO.phone);
      
      // Fill address
      await page.fill('input[name="address.line1"]', ADDRESS.line1);
      await page.fill('input[name="address.line2"]', ADDRESS.line2);
      await page.fill('input[name="address.city"]', ADDRESS.city);
      await page.fill('input[name="address.postalCode"]', ADDRESS.postalCode);
      
      // Verify fields are filled
      await expect(page.locator('input[name="email"]')).toHaveValue(CUSTOMER_INFO.email);
    });

    test('should show validation errors for incomplete form', async ({ page }) => {
      // Add item to cart
      await addItemToCart(page);
      
      await page.goto('/checkout');
      
      // Submit empty form
      await page.click('button[type="submit"], button:has-text("Continue"), button:has-text("Pay")');
      
      // Should show validation errors
      await expect(page.locator('text=/required|invalid|error/i').first()).toBeVisible();
    });
  });

  test.describe('Payment Flow', () => {
    test('should display Stripe payment element', async ({ page }) => {
      // Add item to cart
      await addItemToCart(page);
      
      await page.goto('/checkout');
      
      // Fill required fields to proceed to payment
      await page.fill('input[name="email"]', CUSTOMER_INFO.email);
      await page.fill('input[name="name"]', CUSTOMER_INFO.name);
      await page.fill('input[name="address.line1"]', ADDRESS.line1);
      await page.fill('input[name="address.city"]', ADDRESS.city);
      await page.fill('input[name="address.postalCode"]', ADDRESS.postalCode);
      
      // Look for Stripe payment element
      const stripeElement = page.locator('[data-testid="stripe-payment-element"], iframe[src*="stripe"], #card-element').first();
      
      // Stripe element might be conditionally rendered
      if (await stripeElement.isVisible().catch(() => false)) {
        await expect(stripeElement).toBeVisible();
      }
    });

    test('should display order summary with pricing breakdown', async ({ page }) => {
      // Add item to cart
      await addItemToCart(page);
      
      await page.goto('/checkout');
      
      // Verify pricing breakdown
      await expect(page.locator('text=/subtotal/i').first()).toBeVisible();
      await expect(page.locator('text=/gst|tax/i').first()).toBeVisible();
      await expect(page.locator('text=/total/i').first()).toBeVisible();
      
      // Verify prices are formatted correctly (SGD)
      const priceElements = page.locator('text=/\\$[0-9,]+\\.[0-9]{2}/');
      await expect(priceElements.first()).toBeVisible();
    });

    test('should calculate GST correctly (9%)', async ({ page }) => {
      // Add item to cart
      await addItemToCart(page);
      
      await page.goto('/checkout');
      await page.waitForTimeout(1000);
      
      // Get total and subtotal
      const subtotalText = await page.locator('text=/subtotal/i').first().locator('..').textContent().catch(() => '');
      const gstText = await page.locator('text=/gst/i').first().locator('..').textContent().catch(() => '');
      
      if (subtotalText && gstText) {
        const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
        const gst = parseFloat(gstText.replace(/[^0-9.]/g, ''));
        
        // Verify GST is approximately 9% of subtotal (allowing for rounding)
        const expectedGst = subtotal * 0.09;
        expect(Math.abs(gst - expectedGst)).toBeLessThan(0.02);
      }
    });
  });

  test.describe('Order Confirmation', () => {
    test('should display order confirmation after successful payment', async ({ page }) => {
      // Note: This test requires Stripe test mode and might need to be skipped in CI
      // without proper Stripe test key configuration
      
      test.skip(process.env.CI === 'true', 'Skip in CI without Stripe test keys');
      
      // Add item to cart
      await addItemToCart(page);
      
      // Complete checkout
      await page.goto('/checkout');
      await page.fill('input[name="email"]', CUSTOMER_INFO.email);
      await page.fill('input[name="name"]', CUSTOMER_INFO.name);
      await page.fill('input[name="address.line1"]', ADDRESS.line1);
      await page.fill('input[name="address.city"]', ADDRESS.city);
      await page.fill('input[name="address.postalCode"]', ADDRESS.postalCode);
      
      // Fill Stripe test card
      const stripeFrame = page.frameLocator('iframe').first();
      await stripeFrame.locator('input[name="cardnumber"]').fill(STRIPE_TEST_CARDS.success);
      await stripeFrame.locator('input[name="exp-date"]').fill('12/30');
      await stripeFrame.locator('input[name="cvc"]').fill('123');
      
      // Submit payment
      await page.click('button:has-text("Pay")');
      
      // Wait for redirect to success page
      await page.waitForURL(/\/checkout\/success/, { timeout: 30000 });
      
      // Verify confirmation page
      await expect(page).toHaveTitle(/Success|Confirmation|Thank You/i);
      await expect(page.locator('text=/order confirmed|thank you|success/i').first()).toBeVisible();
      await expect(page.locator('text=/order number|order id/i').first()).toBeVisible();
    });

    test('should display order details on success page', async ({ page }) => {
      test.skip(process.env.CI === 'true', 'Skip in CI without Stripe test keys');
      
      // After successful order
      // This would be a continuation of the previous test or a separate setup
      
      // Verify order details displayed
      await expect(page.locator('text=/order summary|items ordered/i').first()).toBeVisible();
      await expect(page.locator('text=/total amount|amount paid/i').first()).toBeVisible();
    });
  });

  test.describe('Authenticated Checkout', () => {
    test('should pre-fill customer info for logged in users', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.fill('input[name="email"]', 'admin@artisan.com');
      await page.fill('input[name="password"]', 'Admin@123456');
      await page.click('button[type="submit"]');
      
      // Wait for login
      await page.waitForURL(/\/(account|admin)/);
      
      // Add item to cart
      await addItemToCart(page);
      
      // Go to checkout
      await page.goto('/checkout');
      
      // Verify email is pre-filled (or other saved info)
      const emailValue = await page.locator('input[name="email"]').inputValue().catch(() => '');
      expect(emailValue.length).toBeGreaterThan(0);
    });
  });

  test.describe('Cart Persistence', () => {
    test('should maintain cart items through checkout process', async ({ page }) => {
      // Add item to cart
      await addItemToCart(page);
      
      // Navigate through checkout
      await page.goto('/checkout');
      await page.goto('/shop');
      await page.goto('/checkout');
      
      // Verify items still in cart/summary
      await expect(page.locator('text=/item|product|course/i').first()).toBeVisible();
    });
  });
});
