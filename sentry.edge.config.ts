// ============================================
// L'Artisan Baking Atelier - Sentry Edge Configuration
// Edge runtime error tracking for middleware and edge functions
// ============================================

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment
    environment: ENVIRONMENT,
    
    // Release tracking
    release: process.env.APP_VERSION || 'development',
    
    // Debug mode
    debug: ENVIRONMENT === 'development',
    
    // Performance Monitoring
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Edge-specific error filtering
    beforeSend(event) {
      // Filter out edge-specific noise
      const errorMessage = event.exception?.values?.[0]?.value;
      
      // Ignore timeout errors that are transient
      if (errorMessage?.includes('Edge Function Timeout') ||
          errorMessage?.includes('FETCH_TIMEOUT')) {
        return null;
      }
      
      return event;
    },
  });
} else {
  console.warn('Sentry DSN not configured. Edge error tracking disabled.');
}
