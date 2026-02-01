// ============================================
// L'Artisan Baking Atelier - Sentry Client Configuration
// Browser-side error tracking and performance monitoring
// ============================================

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_APP_ENV || 'development';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment
    environment: ENVIRONMENT,
    
    // Release tracking (requires build-time environment variable)
    release: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
    
    // Enable debug mode in development
    debug: ENVIRONMENT === 'development',
    
    // Performance Monitoring
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Session Replay for debugging user issues
    replaysSessionSampleRate: ENVIRONMENT === 'production' ? 0.01 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Error filtering
    beforeSend(event) {
      // Filter out specific errors
      const errorMessage = event.exception?.values?.[0]?.value;
      
      // Ignore browser extension errors
      if (errorMessage?.includes('chrome-extension') || 
          errorMessage?.includes('moz-extension')) {
        return null;
      }
      
      // Ignore network errors that are likely user-side
      if (errorMessage?.includes('Network Error') ||
          errorMessage?.includes('Failed to fetch')) {
        return null;
      }
      
      return event;
    },
    
    // integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],
  });
} else {
  console.warn('Sentry DSN not configured. Error tracking disabled.');
}
