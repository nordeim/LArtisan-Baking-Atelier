/**
 * Rate Limiting Module
 * 
 * Sliding window rate limiting using LRU-cache.
 * Prevents API abuse on sensitive endpoints.
 * 
 * Features:
 * - Memory-based storage (suitable for single instance)
 * - Sliding window algorithm
 * - Customizable limits per endpoint
 * - Automatic cleanup of expired entries
 */

// LRU-cache can be used for more complex rate limiting scenarios
// import { LRUCache } from 'lru-cache';

// ============================================
// Types
// ============================================

/**
 * Rate limit configuration options
 */
export interface RateLimitOptions {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum number of requests per window */
  maxRequests: number;
}

/**
 * Rate limiter interface
 */
export interface RateLimiter {
  /**
   * Check if request is within rate limit
   * @param token - Unique identifier (IP address, user ID, etc.)
   * @returns Promise that resolves if allowed, rejects if rate limited
   */
  check(token: string): Promise<void>;
  
  /**
   * Get current count for a token
   * @param token - Unique identifier
   * @returns Current request count
   */
  getCount(token: string): number;
  
  /**
   * Reset rate limit for a token
   * @param token - Unique identifier
   */
  reset(token: string): void;
}

/**
 * Rate limit error
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfter: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// ============================================
// Rate Limiter Factory
// ============================================

/**
 * Create a rate limiter with specified options
 * 
 * @param options - Rate limit configuration
 * @returns RateLimiter instance
 * 
 * @example
 * ```typescript
 * const limiter = rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   maxRequests: 5,
 * });
 * 
 * try {
 *   await limiter.check('user-123');
 *   // Process request
 * } catch (error) {
 *   if (error instanceof RateLimitError) {
 *     // Handle rate limit
 *   }
 * }
 * ```
 */
export function rateLimit(options: RateLimitOptions): RateLimiter {
  const { windowMs, maxRequests } = options;
  
  // Store request counts per token
  // Using a Map to track counts and timestamps
  const tokenStore = new Map<string, { count: number; resetTime: number }>();
  
  // Cleanup expired entries periodically
  const cleanup = () => {
    const now = Date.now();
    for (const [token, data] of tokenStore.entries()) {
      if (now > data.resetTime) {
        tokenStore.delete(token);
      }
    }
  };
  
  // Run cleanup every window duration
  const cleanupInterval = setInterval(cleanup, windowMs);
  
  // Prevent keeping process alive (for serverless environments)
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
  
  return {
    check(token: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const now = Date.now();
        const data = tokenStore.get(token);
        
        // If no data or window has expired, start fresh
        if (!data || now > data.resetTime) {
          tokenStore.set(token, {
            count: 1,
            resetTime: now + windowMs,
          });
          resolve();
          return;
        }
        
        // Check if limit exceeded
        if (data.count >= maxRequests) {
          const retryAfter = Math.ceil((data.resetTime - now) / 1000);
          reject(
            new RateLimitError(
              `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
              retryAfter
            )
          );
          return;
        }
        
        // Increment count and allow
        data.count++;
        resolve();
      });
    },
    
    getCount(token: string): number {
      const now = Date.now();
      const data = tokenStore.get(token);
      
      if (!data || now > data.resetTime) {
        return 0;
      }
      
      return data.count;
    },
    
    reset(token: string): void {
      tokenStore.delete(token);
    },
  };
}

// ============================================
// Pre-configured Rate Limiters
// ============================================

/**
 * Rate limiter for authentication endpoints
 * 
 * 100 requests per hour per IP/user
 * Protects against brute force attacks
 */
export const authRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 100,
});

/**
 * Rate limiter for checkout endpoint
 * 
 * 5 requests per 15 minutes per user
 * Prevents duplicate order creation
 */
export const checkoutRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

/**
 * Rate limiter for password reset
 * 
 * 3 requests per hour per email
 * Prevents email spam
 */
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
});

/**
 * Rate limiter for general API
 * 
 * 1000 requests per hour per IP
 * Standard API protection
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
});

/**
 * Rate limiter for admin endpoints
 * 
 * 500 requests per hour per admin
 * Stricter limits for admin actions
 */
export const adminRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 500,
});
