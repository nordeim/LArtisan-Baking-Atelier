'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

/**
 * Store Layout
 * 
 * Layout wrapper for storefront pages with header, footer, and mobile navigation.
 * Includes cart state management and mobile menu state.
 */

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State for mobile navigation
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-crust-400 text-crust-950 px-4 py-2 rounded-lg font-semibold z-50"
      >
        Skip to main content
      </a>

      <div className="flex flex-col min-h-screen bg-crust-50">
        {/* Header */}
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          isMobileMenuOpen={mobileNavOpen}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-grow"
        >
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
