'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { mainNavItems, isNavItemActive } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { CartBadge } from '@/components/cart/CartBadge';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { getCurrentUser } from '@/lib/auth-client';

/**
 * Header Component
 * 
 * Sticky header with navigation, logo, cart button, and mobile menu toggle.
 * Features scroll-based background transition and backdrop blur.
 */

interface HeaderProps {
  /** Callback when mobile menu button is clicked */
  onMenuClick?: () => void;
  /** Whether mobile menu is currently open */
  isMobileMenuOpen?: boolean;
}

export function Header({
  onMenuClick,
  isMobileMenuOpen = false,
}: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Track scroll position for background transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkAuth();
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-crust-200 bg-crust-50/95 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex h-20 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="L'Artisan Baking Atelier - Home"
          >
            {/* Logo Icon */}
            <div className="w-12 h-12 bg-crust-900 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <svg
                className="w-7 h-7 text-crust-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <path d="M8.5 9.5L12 6l3.5 3.5" />
              </svg>
            </div>

            {/* Brand Text */}
            <div className="hidden sm:block">
              <span className="font-display text-xl font-semibold tracking-tight text-crust-900">
                L&apos;Artisan
              </span>
              <span className="block text-xs text-crust-600 uppercase tracking-widest -mt-0.5">
                Baking Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const isActive = isNavItemActive(item.href, pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'text-crust-900 bg-crust-100'
                      : 'text-crust-700 hover:text-crust-900 hover:bg-crust-100'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={item.description}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Account / Login Link */}
            {user ? (
              <Link
                href="/account"
                className={cn(
                  'hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname.startsWith('/account')
                    ? 'text-crust-900 bg-crust-100'
                    : 'text-crust-700 hover:text-crust-900 hover:bg-crust-100'
                )}
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === '/login'
                    ? 'text-crust-900 bg-crust-100'
                    : 'text-crust-700 hover:text-crust-900 hover:bg-crust-100'
                )}
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <CartBadge
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-lg hover:bg-crust-100 transition-colors"
            />

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                'text-crust-700 hover:text-crust-900 hover:bg-crust-100',
                isMobileMenuOpen && 'bg-crust-100 text-crust-900'
              )}
              onClick={onMenuClick}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

export default Header;
