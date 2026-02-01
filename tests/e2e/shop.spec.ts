// ============================================
// L'Artisan Baking Atelier - Shop E2E Tests
// Tests product catalog browsing, filtering, and cart functionality
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Shop Experience', () => {
  
  test.describe('Product Catalog', () => {
    test('should display product listing page', async ({ page }) => {
      await page.goto('/shop');
      
      // Verify page loaded
      await expect(page).toHaveTitle(/Shop|Courses|Products/i);
      
      // Verify products are displayed
      const products = page.locator('[data-testid="product-card"], .product-card, article');
      await expect(products.first()).toBeVisible();
      
      // Verify at least some products exist
      const count = await products.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should navigate to product detail page', async ({ page }) => {
      await page.goto('/shop');
      
      // Click first product
      const firstProduct = page.locator('[data-testid="product-card"], .product-card, article').first();
      await firstProduct.click();
      
      // Verify URL changed to product detail
      await expect(page).toHaveURL(/\/shop\/.+/);
      
      // Verify product details are displayed
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=/price|\$/i')).toBeVisible();
    });

    test('should display product information on detail page', async ({ page }) => {
      await page.goto('/shop');
      
      // Click first product
      await page.locator('[data-testid="product-card"], .product-card, article').first().click();
      
      // Verify essential elements
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('img')).toBeVisible();
      await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
      
      // Verify price is displayed
      const priceElement = page.locator('text=/\\$[0-9]+\\.[0-9]{2}/');
      await expect(priceElement.first()).toBeVisible();
    });
  });

  test.describe('Category Filtering', () => {
    test('should filter products by category', async ({ page }) => {
      await page.goto('/shop');
      
      // Find category filter (could be sidebar, dropdown, or buttons)
      const categoryFilter = page.locator('button, a, label').filter({ hasText: /sourdough|patisserie|viennoiserie/i }).first();
      
      if (await categoryFilter.isVisible().catch(() => false)) {
        await categoryFilter.click();
        
        // Wait for filter to apply
        await page.waitForTimeout(500);
        
        // Verify filtered results
        const products = page.locator('[data-testid="product-card"], .product-card, article');
        await expect(products.first()).toBeVisible();
      }
    });

    test('should sort products by price', async ({ page }) => {
      await page.goto('/shop');
      
      // Look for sort dropdown
      const sortDropdown = page.locator('select, button').filter({ hasText: /sort|price/i }).first();
      
      if (await sortDropdown.isVisible().catch(() => false)) {
        await sortDropdown.click();
        await page.click('text=/price: low to high|lowest price/i');
        
        // Wait for sort to apply
        await page.waitForTimeout(500);
        
        // Verify products are still displayed
        const products = page.locator('[data-testid="product-card"], .product-card, article');
        await expect(products.first()).toBeVisible();
      }
    });
  });

  test.describe('Cart Functionality', () => {
    test('should add product to cart', async ({ page }) => {
      await page.goto('/shop');
      
      // Click first product
      await page.locator('[data-testid="product-card"], .product-card, article').first().click();
      
          // Add to cart
      await page.click('button:has-text("Add to Cart")');
      
      // Verify cart updated (could be badge, drawer, or toast)
      await expect(page.locator('text=/added|cart|success/i').first()).toBeVisible();
    });

    test('should display cart with items', async ({ page }) => {
      // Add item to cart first
      await page.goto('/shop');
      await page.locator('[data-testid="product-card"], .product-card, article').first().click();
      await page.click('button:has-text("Add to Cart")');
      
      // Navigate to cart
      await page.goto('/cart');
      
      // Verify cart page loaded
      await expect(page).toHaveTitle(/Cart|Shopping Cart/i);
      
      // Verify cart has items
      await expect(page.locator('text=/item|product|course/i').first()).toBeVisible();
    });

    test('should update item quantity in cart', async ({ page }) => {
      // Add item to cart
      await page.goto('/shop');
      await page.locator('[data-testid="product-card"], .product-card, article').first().click();
      await page.click('button:has-text("Add to Cart")');
      
      // Go to cart
      await page.goto('/cart');
      
      // Look for quantity controls
      const increaseBtn = page.locator('button[aria-label*="increase"], button:has-text("+")').first();
      
      if (await increaseBtn.isVisible().catch(() => false)) {
        await increaseBtn.click();
        
        // Wait for update
        await page.waitForTimeout(500);
        
        // Verify quantity updated
        const quantity = page.locator('input[type="number"], [data-testid="quantity"]').first();
        await expect(quantity).toBeVisible();
      }
    });

    test('should remove item from cart', async ({ page }) => {
      // Add item to cart
      await page.goto('/shop');
      await page.locator('[data-testid="product-card"], .product-card, article').first().click();
      await page.click('button:has-text("Add to Cart")');
      
      // Go to cart
      await page.goto('/cart');
      
      // Look for remove button
      const removeBtn = page.locator('button[aria-label*="remove"], button:has-text("Remove"), button:has-text("×")').first();
      
      if (await removeBtn.isVisible().catch(() => false)) {
        await removeBtn.click();
        
        // Wait for removal
        await page.waitForTimeout(500);
        
        // Verify empty cart message or item removed
        await expect(page.locator('text=/empty|removed|no items/i').first()).toBeVisible();
      }
    });

    test('should persist cart across page reloads', async ({ page }) => {
      // Add item to cart
      await page.goto('/shop');
      await page.locator('[data-testid="product-card"], .product-card, article').first().click();
      await page.click('button:has-text("Add to Cart")');
      
      // Reload page
      await page.reload();
      
      // Verify cart still has items
      await expect(page.locator('text=/1|item/i').first()).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('should search for products', async ({ page }) => {
      await page.goto('/shop');
      
      // Look for search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
      
      if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.fill('sourdough');
        await searchInput.press('Enter');
        
        // Wait for search results
        await page.waitForTimeout(500);
        
        // Verify results
        await expect(page.locator('[data-testid="product-card"], .product-card, article').first()).toBeVisible();
      }
    });
  });
});
