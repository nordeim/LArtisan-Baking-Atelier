// ============================================
// L'Artisan Baking Atelier - OpenTelemetry Instrumentation
// Registers monitoring and observability on server startup
// ============================================

import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Register Sentry for Node.js runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  
  // Register Sentry for Edge runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
  
  // Log initialization in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Instrumentation registered:', process.env.NEXT_RUNTIME);
  }
}

// Export Sentry for use in the application
export { Sentry };
