import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'L\'Artisan Baking Atelier',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/lib/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'node_modules',
      '.next',
      'dist',
      '**/*.e2e.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'src/lib/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
    alias: {
      '@/*': path.resolve(__dirname, './src'),
    },
  },
  resolve: {
    alias: {
      '@/*': path.resolve(__dirname, './src'),
    },
  },
});
