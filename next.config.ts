import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output standalone build for Docker deployment
  output: 'standalone',

  // Enable React Strict Mode
  reactStrictMode: true,

  // Enable compression
  compress: true,

  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Enable typed routes
  typedRoutes: true,

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Note: Removed /admin → /admin/login redirect
      // The protected layout now handles auth redirection
      // This prevents redirect loops with the login page
      {
        source: '/courses',
        destination: '/shop',
        permanent: true,
      },
    ];
  },

  // Turbopack configuration
  turbopack: {
    // Empty config enables Turbopack without custom webpack config
  },
};

export default nextConfig;
