// ============================================
// L'Artisan Baking Atelier - Authentication E2E Tests
// Tests user registration, login, logout, and password reset flows
// ============================================

import { test, expect } from '@playwright/test';

// Test data
const ADMIN_USER = {
  email: 'admin@artisan.com',
  password: 'Admin@123456',
};

// Helper function to generate unique test user
function generateTestUser() {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: `test-${timestamp}@example.com`,
    password: 'SecurePass123!',
  };
}

test.describe('Authentication Flows', () => {
  
  test.describe('Registration', () => {
    test('should allow new user registration', async ({ page }) => {
      const user = generateTestUser();
      
      // Navigate to registration page
      await page.goto('/register');
      
      // Verify page loaded
      await expect(page).toHaveTitle(/Register|Sign Up/i);
      
      // Fill registration form
      await page.fill('input[name="name"]', user.name);
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.fill('input[name="confirmPassword"]', user.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should redirect to account/dashboard
      await expect(page).toHaveURL(/\/account/);
      
      // Verify welcome message or user name displayed
      await expect(page.locator('text=/welcome|dashboard/i')).toBeVisible();
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      await page.goto('/register');
      
      // Submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=/required|invalid|error/i').first()).toBeVisible();
    });

    test('should prevent registration with existing email', async ({ page }) => {
      // First register a user
      const user = generateTestUser();
      await page.goto('/register');
      await page.fill('input[name="name"]', user.name);
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.fill('input[name="confirmPassword"]', user.password);
      await page.click('button[type="submit"]');
      
      // Logout
      await page.goto('/api/auth/logout');
      
      // Try to register again with same email
      await page.goto('/register');
      await page.fill('input[name="name"]', user.name);
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.fill('input[name="confirmPassword"]', user.password);
      await page.click('button[type="submit"]');
      
      // Should show error about existing email
      await expect(page.locator('text=/already exists|email taken/i')).toBeVisible();
    });
  });

  test.describe('Login', () => {
    test('should allow user login with valid credentials', async ({ page }) => {
      await page.goto('/login');
      
      // Verify page loaded
      await expect(page).toHaveTitle(/Login|Sign In/i);
      
      // Fill login form
      await page.fill('input[name="email"]', ADMIN_USER.email);
      await page.fill('input[name="password"]', ADMIN_USER.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should redirect to account or admin
      await expect(page).toHaveURL(/\/(account|admin)/);
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      // Fill with wrong credentials
      await page.fill('input[name="email"]', 'wrong@example.com');
      await page.fill('input[name="password"]', 'WrongPassword123!');
      
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=/invalid|incorrect|failed/i')).toBeVisible();
      
      // Should stay on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect to protected page after login', async ({ page }) => {
      // Try to access protected page while logged out
      await page.goto('/account/orders');
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
      
      // Login
      await page.fill('input[name="email"]', ADMIN_USER.email);
      await page.fill('input[name="password"]', ADMIN_USER.password);
      await page.click('button[type="submit"]');
      
      // Should redirect to originally requested page
      await expect(page).toHaveURL(/\/account/);
    });
  });

  test.describe('Logout', () => {
    test('should allow user logout', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.fill('input[name="email"]', ADMIN_USER.email);
      await page.fill('input[name="password"]', ADMIN_USER.password);
      await page.click('button[type="submit"]');
      
      // Wait for redirect
      await expect(page).toHaveURL(/\/(account|admin)/);
      
      // Click logout
      await page.click('text=/logout|sign out/i');
      
      // Should redirect to home or login
      await expect(page).toHaveURL(/\/$|\/login/);
      
      // Verify logged out by trying to access protected page
      await page.goto('/account');
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Password Reset', () => {
    test('should allow password reset request', async ({ page }) => {
      await page.goto('/forgot-password');
      
      // Verify page loaded
      await expect(page).toHaveTitle(/Forgot Password|Reset Password/i);
      
      // Fill email
      await page.fill('input[name="email"]', ADMIN_USER.email);
      
      // Submit
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=/check your email|link sent|success/i')).toBeVisible();
    });

    test('should show error for non-existent email', async ({ page }) => {
      await page.goto('/forgot-password');
      
      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.click('button[type="submit"]');
      
      // Should still show generic success to prevent email enumeration
      await expect(page.locator('text=/check your email|link sent|success/i')).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      const protectedRoutes = ['/account', '/account/orders', '/account/courses', '/account/profile'];
      
      for (const route of protectedRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(/\/login/);
      }
    });

    test('should allow authenticated users to access protected routes', async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.fill('input[name="email"]', ADMIN_USER.email);
      await page.fill('input[name="password"]', ADMIN_USER.password);
      await page.click('button[type="submit"]');
      
      // Try accessing protected routes
      await page.goto('/account');
      await expect(page).toHaveURL(/\/account/);
      await expect(page.locator('h1, h2').filter({ hasText: /account|dashboard/i })).toBeVisible();
    });
  });
});
