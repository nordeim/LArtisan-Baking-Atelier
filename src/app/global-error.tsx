'use client';

// ============================================
// L'Artisan Baking Atelier - Global Error Boundary
// Catches and reports unhandled errors in the application
// ============================================

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error, {
      tags: {
        error_type: 'global_error_boundary',
        digest: error.digest,
      },
      extra: {
        errorDigest: error.digest,
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-crust-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          {/* Error Title */}
          <h1 className="font-display text-2xl font-bold text-crust-900 mb-2">
            Something Went Wrong
          </h1>
          
          {/* Error Message */}
          <p className="text-crust-600 mb-6">
            We apologize for the inconvenience. Our team has been notified and is working to resolve this issue.
          </p>
          
          {/* Error ID for support */}
          {error.digest && (
            <div className="bg-crust-100 rounded-lg p-3 mb-6">
              <p className="text-xs text-crust-500 uppercase tracking-wide mb-1">
                Error Reference
              </p>
              <p className="text-sm font-mono text-crust-700 break-all">
                {error.digest}
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={reset}
              className="bg-crust-800 hover:bg-crust-900 text-white"
            >
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="border-crust-300 text-crust-700 hover:bg-crust-100"
            >
              Go Home
            </Button>
          </div>
          
          {/* Support Link */}
          <p className="mt-6 text-sm text-crust-500">
            Need help?{' '}
            <a 
              href="mailto:support@artisan-baking.com" 
              className="text-crust-700 underline hover:text-crust-900"
            >
              Contact Support
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
