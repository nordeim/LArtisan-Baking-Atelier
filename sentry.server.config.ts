// ============================================
// L'Artisan Baking Atelier - Sentry Server Configuration
// Server-side error tracking and performance monitoring
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
    
    // Performance Monitoring - adjust sample rate for production
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Profiles sample rate
    profilesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Error filtering
    beforeSend(event) {
      // Filter out specific server-side errors
      const errorMessage = event.exception?.values?.[0]?.value;
      
      // Ignore database connection errors during deployments
      if (errorMessage?.includes('Connection terminated unexpectedly') ||
          errorMessage?.includes('connection terminated by administrator')) {
        return null;
      }
      
      return event;
    },
    
    // Integrations
    integrations: [
      Sentry.prismaIntegration(),
    ],
  });
} else {
  console.warn('Sentry DSN not configured. Server error tracking disabled.');
}
