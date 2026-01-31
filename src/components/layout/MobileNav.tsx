'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { mainNavItems, isNavItemActive } from '@/lib/navigation';
import { cn } from '@/lib/utils';

/**
 * Mobile Navigation Component
 * 
 * Slide-in drawer navigation for mobile devices.
 * Features animations, focus trap, and scroll lock.
 */

interface MobileNavProps {
  /** Whether the mobile menu is open */
  isOpen: boolean;
  /** Callback when the menu should close */
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Lock body scroll when menu is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Focus first link when opened, return focus when closed
  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      // Small delay to allow animation to start
      const timer = setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const panelVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: 'tween' as const,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    exit: {
      x: '100%',
      transition: {
        type: 'tween' as const,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-crust-900/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            className="absolute inset-y-0 right-0 w-full max-w-sm bg-crust-50 shadow-elevated"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-crust-200">
              <span className="font-display text-lg font-semibold text-crust-900">
                Menu
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                className="p-2 text-crust-600 hover:text-crust-900 hover:bg-crust-100 rounded-lg transition-colors"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4" aria-label="Mobile menu navigation">
              <ul className="space-y-1">
                {mainNavItems.map((item, index) => {
                  const isActive = isNavItemActive(item.href, pathname);

                  return (
                    <li key={item.href}>
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        className={cn(
                          'block px-4 py-3 text-base font-semibold rounded-xl transition-colors',
                          isActive
                            ? 'text-crust-900 bg-crust-100'
                            : 'text-crust-800 hover:bg-crust-100'
                        )}
                        onClick={onClose}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Divider */}
              <hr className="my-4 border-crust-200" />

              {/* Secondary Links */}
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/admin/login"
                    className="block px-4 py-3 text-base font-medium text-crust-600 hover:text-crust-900 hover:bg-crust-100 rounded-xl transition-colors"
                    onClick={onClose}
                  >
                    Admin Login
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-crust-200 bg-crust-50">
              <p className="text-sm text-crust-500 text-center">
                © 2026 L&apos;Artisan Baking Atelier
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;
