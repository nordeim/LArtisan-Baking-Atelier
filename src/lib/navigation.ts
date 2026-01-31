/**
 * Navigation Configuration
 * 
 * Centralized navigation data for Header, Footer, and Mobile Navigation.
 * Edit this file to update navigation items across the application.
 */

// Icon type can be added when needed
// import { LucideIcon } from 'lucide-react';

// ============================================
// Types
// ============================================

/**
 * Navigation item structure
 */
export interface NavItem {
  /** URL path */
  href: string;
  /** Display label */
  label: string;
  /** Optional description for tooltips */
  description?: string;
  /** Optional icon name (Lucide icon) */
  icon?: string;
  /** Child items for dropdown menus */
  children?: NavItem[];
}

/**
 * Footer navigation groups
 */
export interface FooterNavGroups {
  shop: NavItem[];
  resources: NavItem[];
  company: NavItem[];
  legal: NavItem[];
}

// ============================================
// Main Navigation (Header)
// ============================================

/**
 * Main navigation items displayed in the header
 */
export const mainNavItems: NavItem[] = [
  {
    href: '/shop',
    label: 'Courses',
    description: 'Browse our professional baking courses',
  },
  {
    href: '/about',
    label: 'Our Story',
    description: 'Discover our heritage and craft',
  },
  {
    href: '/journal',
    label: 'Journal',
    description: 'Baking tips, recipes, and stories',
  },
  {
    href: '/contact',
    label: 'Contact',
    description: 'Get in touch with us',
  },
];

// ============================================
// Footer Navigation
// ============================================

/**
 * Footer navigation grouped by category
 */
export const footerNavItems: FooterNavGroups = {
  shop: [
    {
      href: '/shop',
      label: 'All Products',
    },
    {
      href: '/shop?category=sourdough',
      label: 'Sourdough',
    },
    {
      href: '/shop?category=patisserie',
      label: 'Pâtisserie',
    },
    {
      href: '/shop?category=viennoiserie',
      label: 'Viennoiserie',
    },
    {
      href: '/shop?isFeatured=true',
      label: 'Featured',
    },
  ],
  resources: [
    {
      href: '/free-guide',
      label: 'Free Starter Guide',
    },
    {
      href: '/recipes',
      label: 'Recipes',
    },
    {
      href: '/faq',
      label: 'FAQ',
    },
    {
      href: '/journal',
      label: 'Journal',
    },
    {
      href: '/contact',
      label: 'Contact Us',
    },
  ],
  company: [
    {
      href: '/about',
      label: 'About Us',
    },
    {
      href: '/instructors',
      label: 'Instructors',
    },
    {
      href: '/careers',
      label: 'Careers',
    },
    {
      href: '/press',
      label: 'Press Kit',
    },
  ],
  legal: [
    {
      href: '/privacy',
      label: 'Privacy Policy',
    },
    {
      href: '/terms',
      label: 'Terms of Service',
    },
    {
      href: '/refund',
      label: 'Refund Policy',
    },
    {
      href: '/shipping',
      label: 'Shipping Policy',
    },
  ],
};

// ============================================
// Admin Navigation
// ============================================

/**
 * Admin dashboard navigation
 */
export const adminNavItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: 'ShoppingBag',
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: 'Package',
  },
  {
    href: '/admin/customers',
    label: 'Customers',
    icon: 'Users',
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: 'Settings',
  },
];

// ============================================
// Utility Functions
// ============================================

/**
 * Get navigation item by href
 * 
 * @param items - Navigation items array
 * @param href - URL path to find
 * @returns NavItem or undefined
 */
export function getNavItemByHref(
  items: NavItem[],
  href: string
): NavItem | undefined {
  for (const item of items) {
    if (item.href === href) {
      return item;
    }
    if (item.children) {
      const found = getNavItemByHref(item.children, href);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Check if a nav item is active
 * 
 * @param itemHref - Navigation item href
 * @param currentPath - Current pathname
 * @returns True if active
 */
export function isNavItemActive(itemHref: string, currentPath: string): boolean {
  // Exact match
  if (itemHref === currentPath) {
    return true;
  }
  
  // For /shop (Courses), also active on product pages
  if (itemHref === '/shop' && currentPath.startsWith('/shop/')) {
    return true;
  }
  
  // For /admin, also active on subpages
  if (itemHref === '/admin' && currentPath.startsWith('/admin/')) {
    return true;
  }
  
  return false;
}

/**
 * Flatten navigation items (for search, etc.)
 * 
 * @param items - Navigation items with possible children
 * @returns Flat array of all items
 */
export function flattenNavItems(items: NavItem[]): NavItem[] {
  const flat: NavItem[] = [];
  
  for (const item of items) {
    flat.push(item);
    if (item.children) {
      flat.push(...flattenNavItems(item.children));
    }
  }
  
  return flat;
}
