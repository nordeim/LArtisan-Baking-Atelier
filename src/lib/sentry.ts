// ============================================
// L'Artisan Baking Atelier - Sentry Utilities
// Helper functions for error tracking and monitoring
// ============================================

import * as Sentry from '@sentry/nextjs';

/**
 * Report an error to Sentry with additional context
 */
export function reportError(
  error: Error, 
  context?: Record<string, unknown>
): void {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Set user context for Sentry
 */
export function setUser(user: { 
  id?: string; 
  email?: string; 
  name?: string;
  role?: string;
} | null): void {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
      role: user.role,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string, 
  category?: string, 
  level: Sentry.SeverityLevel = 'info'
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
  });
}

/**
 * Set transaction name for performance monitoring
 */
export function setTransaction(name: string): void {
  Sentry.getCurrentScope().setTransactionName(name);
}

/**
 * Start a performance span
 */
export function startSpan<T>(
  name: string, 
  operation: () => T
): T {
  return Sentry.startSpan({ name }, operation);
}

/**
 * Capture message to Sentry
 */
export function captureMessage(
  message: string, 
  level: Sentry.SeverityLevel = 'info'
): void {
  Sentry.captureMessage(message, level);
}

/**
 * Clear scope (useful on logout)
 */
export function clearScope(): void {
  Sentry.getCurrentScope().clear();
}
