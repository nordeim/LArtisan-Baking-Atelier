# Phase 4: Layout Components — DETAILED SUB-PLAN

## 📋 Executive Overview

**Phase Objective:** Build the foundational layout components that wrap all pages including Header with navigation, Mobile Navigation drawer, Footer, and layout wrappers. These components establish the visual shell and navigation structure for the entire application.

**Estimated Duration:** 3-4 days  
**Dependencies:** Phase 3 (Core Utilities) must be complete  
**Prerequisites:** Tailwind CSS v4 configured, fonts loaded, utilities available

**Success Criteria:**
- [ ] Header is sticky with backdrop blur effect
- [ ] Mobile navigation works with slide-in drawer
- [ ] Navigation links work correctly (routing)
- [ ] Footer displays all links and information
- [ ] All components are responsive (mobile-first)
- [ ] Accessibility: keyboard navigation, focus states, ARIA labels
- [ ] Reduced motion respected for animations
- [ ] TypeScript compilation passes

---

## 🗂️ Task Breakdown

### TASK 4.1: Navigation Data & Types

**Priority:** HIGH  
**Estimated Time:** 30 minutes  
**Dependencies:** None

#### 4.1.1 Navigation Configuration

**File:** `src/lib/navigation.ts`

**Purpose:** Centralized navigation configuration for maintainability.

**Checklist:**
- [ ] Define `NavItem` interface:
  ```typescript
  interface NavItem {
    href: string;
    label: string;
    description?: string;
    icon?: string; // Lucide icon name
    children?: NavItem[]; // For dropdown menus
  }
  ```
- [ ] Create `mainNavItems` array:
  - Shop (`/shop`)
  - Courses (`/courses`)
  - Our Story (`/about`)
  - Journal (`/journal`)
- [ ] Create `footerNavItems` object (grouped by category):
  - Shop (All Products, Sourdough, Pâtisserie, Viennoiserie)
  - Resources (Free Guide, Recipes, FAQ)
  - Company (About, Instructors, Careers)
  - Legal (Privacy, Terms, Refund Policy)
- [ ] Create `adminNavItems` array:
  - Dashboard (`/admin`)
  - Orders (`/admin/orders`)
  - Products (`/admin/products`)
  - Settings (`/admin/settings`)

---

### TASK 4.2: Header Component

**Priority:** CRITICAL  
**Estimated Time:** 3-4 hours  
**Dependencies:** Task 4.1

#### 4.2.1 Header Implementation

**File:** `src/components/layout/Header.tsx`

**Purpose:** Sticky header with navigation, logo, cart, and mobile menu trigger.

**Checklist:**

**Structure:**
- [ ] Semantic `<header>` element
- [ ] Sticky positioning (`sticky top-0`)
- [ ] z-index: 50 (above content)
- [ ] Backdrop blur when scrolled (`backdrop-blur-xl`)
- [ ] Background transition on scroll

**Logo Section:**
- [ ] Link to homepage (`/`)
- [ ] SVG logo icon (artisan/bread theme)
- [ ] Brand name "L'Artisan"
- [ ] Tagline "Baking Atelier" (smaller text)
- [ ] Hover scale effect

**Desktop Navigation:**
- [ ] Map through `mainNavItems`
- [ ] Horizontal flex layout with gap-8
- [ ] Link styling:
  - Text: `text-crust-700`
  - Hover: `text-crust-900` + `bg-crust-100`
  - Padding: `px-4 py-2`
  - Border radius: `rounded-lg`
  - Transition: `transition-colors`
- [ ] Active state indicator (underline or background)
- [ ] Current page detection using `usePathname`

**Right Actions:**
- [ ] Cart button with badge
  - Shopping bag icon (Lucide)
  - Badge shows item count (0 if empty)
  - Link to `/cart`
  - Hover state
- [ ] Mobile menu button (hamburger)
  - Visible only on mobile (`lg:hidden`)
  - Menu icon when closed
  - Close icon when open
  - `aria-expanded` attribute
  - `aria-controls` pointing to mobile menu
  - `aria-label` for accessibility

**Scroll Behavior:**
- [ ] Detect scroll position (`useEffect` + scroll listener)
- [ ] Add `scrolled` class when scrollY > 50
- [ ] Toggle background opacity/border
- [ ] Use passive event listener for performance
- [ ] Cleanup listener on unmount

**Accessibility:**
- [ ] Skip to main content link (visually hidden)
- [ ] ARIA labels on all interactive elements
- [ ] Focus visible states
- [ ] Keyboard navigation support

**Props Interface:**
```typescript
interface HeaderProps {
  cartCount?: number;
}
```

---

### TASK 4.3: Mobile Navigation

**Priority:** CRITICAL  
**Estimated Time:** 3-4 hours  
**Dependencies:** Task 4.2

#### 4.3.1 Mobile Navigation Drawer

**File:** `src/components/layout/MobileNav.tsx`

**Purpose:** Slide-in navigation drawer for mobile devices.

**Checklist:**

**Structure:**
- [ ] AnimatePresence wrapper for exit animations
- [ ] Fixed position overlay (`fixed inset-0`)
- [ ] z-index: 50 (above header)
- [ ] Slide-in panel from right
- [ ] Backdrop overlay with opacity

**Animation (Framer Motion):**
- [ ] Panel animation:
  - Initial: `x: '100%'`
  - Animate: `x: 0`
  - Exit: `x: '100%'`
  - Transition: `type: 'tween', duration: 0.3`
- [ ] Backdrop animation:
  - Initial: `opacity: 0`
  - Animate: `opacity: 1`
  - Exit: `opacity: 0`
- [ ] Respect `prefers-reduced-motion`

**Drawer Header:**
- [ ] "Menu" title
- [ ] Close button (X icon)
  - `aria-label="Close menu"`
  - Top-right corner

**Navigation Links:**
- [ ] Map through `mainNavItems`
- [ ] Vertical stack layout
- [ ] Large touch targets (min 44px height)
- [ ] Link styling:
  - Text: `text-lg font-semibold`
  - Padding: `px-4 py-3`
  - Hover: `bg-crust-100`
  - Full width
- [ ] Divider between sections

**Secondary Actions:**
- [ ] Admin login link (bottom)
- [ ] Divider before secondary actions

**Focus Management:**
- [ ] Trap focus within drawer when open
- [ ] Focus first link when opened
- [ ] Return focus to trigger button when closed
- [ ] Close on Escape key

**Body Scroll Lock:**
- [ ] Prevent background scrolling when open
- [ ] Restore scroll when closed
- [ ] Handle iOS Safari bounce

**Click Outside:**
- [ ] Close drawer when clicking backdrop
- [ ] Don't close when clicking panel

**Props Interface:**
```typescript
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}
```

---

### TASK 4.4: Footer Component

**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Dependencies:** Task 4.1

#### 4.4.1 Footer Implementation

**File:** `src/components/layout/Footer.tsx`

**Purpose:** Multi-column footer with navigation, contact info, and social links.

**Checklist:**

**Structure:**
- [ ] Semantic `<footer>` element
- [ ] Background: `bg-crust-900`
- [ ] Text: `text-crust-300`
- [ ] Padding: `py-16` top, `py-8` bottom

**Top Section (4-5 columns):**

**Column 1: Brand**
- [ ] Logo (smaller version)
- [ ] Brand description (1-2 sentences)
- [ ] Contact email

**Column 2: Shop**
- [ ] Title: "Shop"
- [ ] Map `footerNavItems.shop`
- [ ] Vertical link list
- [ ] Hover: `text-crust-100`

**Column 3: Resources**
- [ ] Title: "Resources"
- [ ] Map `footerNavItems.resources`

**Column 4: Company**
- [ ] Title: "Company"
- [ ] Map `footerNavItems.company`

**Column 5: Legal**
- [ ] Title: "Legal"
- [ ] Map `footerNavItems.legal`

**Link Styling:**
- [ ] Text: `text-sm text-crust-400`
- [ ] Hover: `text-crust-100`
- [ ] Transition: `transition-colors`
- [ ] Space-y-3 between links

**Bottom Bar:**
- [ ] Divider line (`border-t border-crust-800`)
- [ ] Copyright text: "© 2026 L'Artisan Baking Atelier"
- [ ] Social media icons:
  - Instagram
  - YouTube
  - Facebook
  - TikTok
  - Icon size: `w-5 h-5`
  - Hover: `text-crust-100`
  - `aria-label` on each

**Responsive:**
- [ ] Mobile: Single column, stacked
- [ ] Tablet: 2-3 columns
- [ ] Desktop: Full grid (5 columns)

---

### TASK 4.5: Layout Wrappers

**Priority:** HIGH  
**Estimated Time:** 1-2 hours  
**Dependencies:** Tasks 4.2, 4.3, 4.4

#### 4.5.1 Store Layout

**File:** `src/app/(store)/layout.tsx`

**Purpose:** Layout wrapper for storefront pages.

**Checklist:**
- [ ] Import Header, Footer components
- [ ] Import MobileNav component
- [ ] Create layout with state:
  - `mobileNavOpen` state
  - `cartCount` state (placeholder for now)
- [ ] Skip to main content link (accessibility)
- [ ] Header with cart count and mobile toggle
- [ ] MobileNav with isOpen/onClose
- [ ] Main content area (`<main>`)
- [ ] Footer at bottom
- [ ] Flex column layout with min-h-screen

**Structure:**
```tsx
<div className="flex flex-col min-h-screen">
  <Header 
    cartCount={cartCount} 
    onMenuClick={() => setMobileNavOpen(true)}
  />
  <MobileNav 
    isOpen={mobileNavOpen} 
    onClose={() => setMobileNavOpen(false)}
  />
  <main id="main-content" className="flex-grow">
    {children}
  </main>
  <Footer />
</div>
```

#### 4.5.2 Admin Layout

**File:** `src/app/admin/layout.tsx`

**Purpose:** Layout wrapper for admin pages (simpler, no footer).

**Checklist:**
- [ ] Simple header with admin branding
- [ ] Sidebar navigation (collapsible)
- [ ] Main content area
- [ ] No footer (admin pages are tools)
- [ ] Authentication check (placeholder for now)

---

### TASK 4.6: Loading & Error States

**Priority:** MEDIUM  
**Estimated Time:** 1-2 hours  
**Dependencies:** None

#### 4.6.1 Loading Components

**File:** `src/components/ui/loading.tsx`

**Checklist:**
- [ ] `Spinner` component:
  - Circular loading indicator
  - Customizable size
  - Customizable color
  - Uses `animate-spin`
- [ ] `Skeleton` component:
  - Rectangular placeholder
  - Pulse animation
  - For content loading states

#### 4.6.2 Error Boundary (Optional)

**File:** `src/components/error-boundary.tsx`

**Checklist:**
- [ ] React error boundary
- [ ] Fallback UI for errors
- [ ] "Something went wrong" message
- [ ] Retry button

---

## ✅ Phase 4 Integration Checklist

### Pre-Flight Verification
- [ ] Phase 3 complete (utilities available)
- [ ] Tailwind CSS v4 working
- [ ] Fonts loaded (Playfair Display, DM Sans)
- [ ] Icons available (Lucide React)

### Navigation Data
- [ ] `src/lib/navigation.ts` created
- [ ] All nav items defined
- [ ] Types exported

### Header
- [ ] `src/components/layout/Header.tsx` created
- [ ] Sticky behavior works
- [ ] Scroll detection works
- [ ] Logo links to home
- [ ] Desktop navigation renders
- [ ] Mobile menu button visible on mobile
- [ ] Cart button with badge
- [ ] All interactive elements have focus states

### Mobile Navigation
- [ ] `src/components/layout/MobileNav.tsx` created
- [ ] Slide-in animation works
- [ ] Backdrop overlay visible
- [ ] Close button works
- [ ] Navigation links clickable
- [ ] Escape key closes drawer
- [ ] Focus trap working
- [ ] Body scroll lock working

### Footer
- [ ] `src/components/layout/Footer.tsx` created
- [ ] All columns render correctly
- [ ] Links work and hover correctly
- [ ] Social icons present
- [ ] Copyright text correct
- [ ] Responsive layout works

### Layouts
- [ ] Store layout wraps pages
- [ ] Admin layout created
- [ ] Skip to content link present
- [ ] Header + Footer + MobileNav integrated

### Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Focus visible states
- [ ] Skip to content link
- [ ] Keyboard navigation works
- [ ] Reduced motion respected

### Validation Commands (Run These)
```bash
# 1. Type checking
npm run type-check
# Expected: No errors

# 2. Build
npm run build
# Expected: Build succeeds

# 3. Development server
npm run dev
# Expected: Server starts

# 4. Manual testing:
# - Visit http://localhost:3000
# - Verify header is visible
# - Scroll to verify sticky behavior
# - Resize to mobile width (< 1024px)
# - Open/close mobile menu
# - Scroll to footer
# - Verify all links visible
```

### Manual Verification Checklist
- [ ] Header visible on page load
- [ ] Header sticks on scroll
- [ ] Background blur appears on scroll
- [ ] Logo links to home
- [ ] Desktop nav links work
- [ ] Cart button visible
- [ ] Mobile menu button appears at < 1024px
- [ ] Mobile menu opens with slide animation
- [ ] Mobile menu closes with X button
- [ ] Mobile menu closes on Escape key
- [ ] Mobile menu closes on backdrop click
- [ ] Footer visible at bottom
- [ ] Footer columns responsive
- [ ] Footer links work
- [ ] No console errors

---

## 📊 Phase 4 Completion Criteria

**Definition of Done:**
1. Header is sticky and responsive
2. Mobile navigation works correctly
3. Footer displays all information
4. Layouts wrap pages correctly
5. All components pass TypeScript
6. Build succeeds without errors
7. Manual testing passes
8. Accessibility requirements met

**Next Phase Trigger:**
Once all criteria above are met, proceed to **Phase 5: Section Components (Homepage)**

---

## 🎨 Design Specifications

### Header
- Height: `h-20` (80px)
- Background: `bg-crust-50/80` + `backdrop-blur-xl`
- Border bottom: `border-b border-crust-200`
- Z-index: `z-50`

### Mobile Nav
- Width: `w-full sm:max-w-sm`
- Background: `bg-crust-50`
- Animation: 300ms ease-out

### Footer
- Background: `bg-crust-900`
- Text: `text-crust-300`
- Link hover: `text-crust-100`

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Author:** Master Architect
