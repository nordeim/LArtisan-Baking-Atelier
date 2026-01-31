# L'Artisan Baking Atelier — MASTER EXECUTION PLAN

## Executive Summary

This document consolidates the architectural blueprint from `execution_draft_plan.md` and the design specification from `static_html_mockup.md` into a comprehensive, phased implementation roadmap. The goal is to transform the static "Editorial Patisserie" landing page into a fully-functional Next.js 16.1.4 e-commerce platform with Tailwind CSS v4, PostgreSQL 16, Prisma 7.3.0, and Singapore GST compliance.

**Design Concept:** "Édition Boulangerie" — A luxury culinary magazine aesthetic merged with the intimate warmth of a master baker's atelier. Warm OKLCH color palette, asymmetric golden-ratio grids, and tactile micro-interactions.

---

## Phase 0: Pre-Flight Analysis & Validation

### 0.1 Technical Stack Confirmation

| Component | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.4 | App Router, Server Components, RSC |
| React | 19.x | Concurrent features, Server Actions |
| Tailwind CSS | 4.0.x | CSS-first theming, OKLCH colors |
| PostgreSQL | 16 | Primary database, DECIMAL precision |
| Prisma | 7.3.0 | ORM with `@prisma/adapter-pg` |
| TypeScript | 5.x | Type safety |
| Jose | latest | JWT signing/verification |
| Stripe | latest | Payment processing |

### 0.2 Critical Migration Notes

**Tailwind v4 Breaking Changes to Address:**
- `tailwind.config.js` → `@theme` in CSS
- `bg-opacity-*` → `bg-color/opacity` syntax
- `shadow-sm` → `shadow-xs` (renamed)
- `bg-gradient-to-*` → `bg-linear-to-*`
- `outline-none` → `outline-hidden`
- `ring` → `ring-3`
- CSS variables: `[--var]` → `(--var)`

### 0.3 Success Criteria

- [ ] WCAG AA contrast compliance (4.5:1 minimum)
- [ ] WCAG AAA for critical text (7:1)
- [ ] Singapore GST 9% calculation with `DECIMAL(10,4)` precision
- [ ] PDPA-compliant data handling (encryption at rest)
- [ ] Mobile-first responsive design
- [ ] Lighthouse score >90 (Performance, Accessibility, Best Practices, SEO)

---

## Phase 1: Foundation & Infrastructure

**Objective:** Establish the project foundation, Docker environment, and Tailwind v4 CSS-first theming system.

**Estimated Duration:** 2-3 days

### 1.1 Project Initialization

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `package.json` | Create | Dependencies: next, react, react-dom, tailwindcss, @tailwindcss/vite, prisma, @prisma/client, jose, bcryptjs, stripe, zod, lucide-react, framer-motion | [ ] All dependencies with correct versions<br>[ ] Scripts for dev/build/test/lint<br>[ ] TypeScript configuration |
| `tsconfig.json` | Create | Strict mode, path aliases (`@/*` → `src/*`), module resolution | [ ] Strict: true<br>[ ] Path aliases configured<br>[ ] Next.js types included |
| `.env.example` | Create | Template for all environment variables | [ ] DATABASE_URL format<br>[ ] JWT_SECRET placeholder<br>[ ] Stripe keys<br>[ ] Redis URL |
| `.env.local` | Create | Local development secrets (gitignored) | [ ] Never commit to git<br>[ ] Document all variables |

### 1.2 Docker Infrastructure

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `docker-compose.yml` | Create | PostgreSQL 16, Redis 7, Next.js app services | [ ] Health checks for postgres<br>[ ] Volume persistence<br>[ ] Network isolation<br>[ ] Environment variable injection |
| `Dockerfile` | Create | Multi-stage build for production | [ ] Node 20 base image<br>[ ] Dependency caching layer<br>[ ] Build stage separate from runtime<br>[ ] Non-root user for security |
| `.dockerignore` | Create | Exclude node_modules, .git, .env files | [ ] Comprehensive exclusion list |

**Docker Compose Service Dependencies:**
```
postgres → app (depends_on with condition: service_healthy)
redis → app
```

### 1.3 Tailwind CSS v4 Configuration

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/globals.css` | Create | CSS-first theming with `@theme` directive | [ ] `@import "tailwindcss"` at top<br>[ ] OKLCH color palette (crust-50 to crust-950)<br>[ ] Custom font families (Playfair Display, DM Sans)<br>[ ] Animation keyframes (fade-up, float)<br>[ ] Base layer resets<br>[ ] Custom utilities layer |

**Critical Theme Variables to Define:**
```css
@theme {
  /* Colors - Warm Artisan Palette (OKLCH) */
  --color-crust-50: oklch(0.985 0.005 75);
  --color-crust-100: oklch(0.96 0.015 80);
  --color-crust-200: oklch(0.91 0.03 80);
  --color-crust-300: oklch(0.84 0.06 75);
  --color-crust-400: oklch(0.75 0.1 70); /* Buttery Gold CTA */
  --color-crust-500: oklch(0.65 0.12 65);
  --color-crust-600: oklch(0.55 0.1 60);
  --color-crust-700: oklch(0.45 0.08 55);
  --color-crust-800: oklch(0.3 0.06 50);
  --color-crust-900: oklch(0.2 0.04 45); /* Dark Cocoa */
  --color-crust-950: oklch(0.12 0.02 40);
  --color-sage-400: oklch(0.75 0.06 130);
  --color-sage-500: oklch(0.65 0.08 125);
  
  /* Typography */
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "DM Sans", system-ui, sans-serif;
  
  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
  --spacing-30: 7.5rem;
  
  /* Shadows */
  --shadow-card: 0 4px 20px -4px rgba(44, 24, 16, 0.08);
  --shadow-card-hover: 0 20px 40px -12px rgba(44, 24, 16, 0.15);
  --shadow-elevated: 0 25px 50px -12px rgba(44, 24, 16, 0.18);
  --shadow-glow: 0 0 60px -15px rgba(212, 165, 116, 0.4);
  
  /* Animations */
  --animate-fade-up: fade-up 0.6s ease-out forwards;
  --animate-float: float 6s ease-in-out infinite;
}
```

### 1.4 Vite Configuration

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `vite.config.ts` | Create | Tailwind Vite plugin integration | [ ] `@tailwindcss/vite` plugin<br>[ ] Path alias resolution<br>[ ] Build optimization settings |

---

## Phase 2: Database Schema & ORM

**Objective:** Design and implement the Prisma schema with PDPA compliance, DECIMAL precision, and relationships.

**Estimated Duration:** 2-3 days

### 2.1 Prisma Schema

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `prisma/schema.prisma` | Create | Complete data model with enums, relations | [ ] `postgresqlExtensions` preview feature<br>[ ] `pgcrypto` extension<br>[ ] DECIMAL(10,4) for all monetary fields<br>[ ] GST rate field (4,4 precision)<br>[ ] PDPA fields (deletionRequested, dataExportRequested)<br>[ ] Proper relation mappings |

**Schema Models to Implement:**
1. `User` - Authentication, roles, PDPA flags
2. `Account` - OAuth account linking
3. `Session` - JWT session storage
4. `Product` - Catalog with stock, GST rate
5. `Category` - Product categorization
6. `Order` - Order with financial precision
7. `OrderItem` - Line items with historical pricing
8. `Review` - Product reviews

**Enums Required:**
- `UserRole`: CUSTOMER, ADMIN, BAKER
- `OrderStatus`: PENDING, CONFIRMED, PREPARING, READY, SHIPPED, DELIVERED, CANCELLED
- `PaymentStatus`: PENDING, PAID, FAILED, REFUNDED

### 2.2 Database Client & Connection

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/prisma.ts` | Create | Singleton Prisma client with connection pooling | [ ] Global singleton pattern<br>[ ] Connection error handling<br>[ ] Development hot reload support |
| `prisma/migrations/` | Generate | Initial migration files | [ ] Run `prisma migrate dev --name init`<br>[ ] Verify migration SQL |

### 2.3 Seed Data

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `prisma/seed.ts` | Create | Initial categories, products, admin user | [ ] Admin user with bcrypt hashed password<br>[ ] Categories: Sourdough, Pâtisserie, Viennoiserie<br>[ ] Sample products with realistic prices<br>[ ] Seed script configured in package.json |

**Seed Data Requirements:**
- 1 Admin user (admin@artisan.com / Admin@123456)
- 3 Categories
- 5+ Products (mix of featured/non-featured)
- Realistic Singapore pricing (SGD)

---

## Phase 3: Core Utilities & Authentication

**Objective:** Implement authentication, financial calculations, and security utilities.

**Estimated Duration:** 2-3 days

### 3.1 Authentication Utilities

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/auth.ts` | Create | JWT handling with Jose, bcrypt password hashing | [ ] `hashPassword(password)` → Promise<string><br>[ ] `verifyPassword(password, hashed)` → Promise<boolean><br>[ ] `createToken(payload)` → Promise<string><br>[ ] `verifyToken(token)` → Promise<JWTPayload \| null><br>[ ] `setAuthCookie(token)` → Promise<void><br>[ ] `removeAuthCookie()` → Promise<void><br>[ ] `getCurrentUser()` → Promise<JWTPayload \| null><br>[ ] `requireAuth(req)` middleware helper |

**JWT Payload Interface:**
```typescript
interface JWTPayload {
  sub: string;      // user id
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
```

**Security Requirements:**
- Cookie name: `__Host-artisan-token` (prefix for security)
- httpOnly: true
- secure: true in production
- sameSite: 'strict'
- maxAge: 8 hours

### 3.2 GST Calculator

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/gst-calculator.ts` | Create | Singapore GST 9% with integer arithmetic | [ ] `calculateGST(amountInCents, gstRate?)` → PricingBreakdown<br>[ ] `formatPrice(cents)` → SGD formatted string<br>[ ] `priceToCents(dollars)` → number<br>[ ] `centsToDollars(cents)` → number<br>[ ] No floating-point arithmetic |

**PricingBreakdown Interface:**
```typescript
interface PricingBreakdown {
  subtotal: number;  // cents
  gstAmount: number; // cents
  total: number;     // cents
}
```

### 3.3 Rate Limiting

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/rate-limit.ts` | Create | LRU-based rate limiting | [ ] `rateLimit(options)` factory<br>[ ] `authRateLimit` instance (100 req/hour)<br>[ ] `checkoutRateLimit` instance (5 req/15min)<br>[ ] Token-based identification |

### 3.4 Validation Schemas

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/validation.ts` | Create | Zod schemas for all API inputs | [ ] Checkout schema<br>[ ] Login schema<br>[ ] Register schema<br>[ ] Product filter schema |

---

## Phase 4: Layout Components

**Objective:** Build the foundational layout components that wrap all pages.

**Estimated Duration:** 2-3 days

### 4.1 Root Layout

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/layout.tsx` | Create | Root layout with fonts, metadata, providers | [ ] Google Fonts (Playfair Display, DM Sans)<br>[ ] Metadata for SEO<br>[ ] OpenGraph tags<br>[ ] Viewport configuration<br>[ ] Lang attribute (en-SG)<br>[ ] CSS variable injection |

**Metadata Requirements:**
- Title: "L'Artisan Baking Atelier | Premium Artisan Boulangerie"
- Description with keywords
- OpenGraph for social sharing
- Robots meta for indexing

### 4.2 Header Component

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/layout/Header.tsx` | Create | Sticky header with mobile navigation | [ ] Logo with brand styling<br>[ ] Desktop navigation (Shop, Courses, About, Journal)<br>[ ] Cart icon with badge<br>[ ] Mobile menu trigger<br>[ ] Sticky behavior with backdrop blur<br>[ ] ARIA attributes for accessibility<br>[ ] Reduced motion support |

**Props Interface:**
```typescript
interface HeaderProps {
  cartCount?: number;
}
```

### 4.3 Mobile Navigation

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/layout/MobileNav.tsx` | Create | Sheet-based mobile navigation | [ ] Slide-in drawer from right<br>[ ] Close button<br>[ ] Navigation links<br>[ ] Footer actions (Admin Login)<br>[ ] Focus trap when open<br>[ ] Escape key to close<br>[ ] Body scroll lock |

**Props Interface:**
```typescript
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ href: string; label: string }>;
}
```

### 4.4 Footer Component

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/layout/Footer.tsx` | Create | Multi-column footer with social links | [ ] Brand column with description<br>[ ] Courses navigation<br>[ ] Resources navigation<br>[ ] Company navigation<br>[ ] Legal navigation<br>[ ] Social media icons<br>[ ] Copyright notice<br>[ ] Responsive grid layout |

### 4.5 Reduced Motion Hook

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/hooks/useReducedMotion.ts` | Create | Detect user motion preference | [ ] Returns boolean<br>[ ] SSR-safe<br>[ ] Media query listener |

---

## Phase 5: Section Components (Homepage)

**Objective:** Convert static HTML sections from mockup into React components with animations.

**Estimated Duration:** 3-4 days

### 5.1 Hero Section

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/sections/HeroSection.tsx` | Create | Asymmetric split hero with CTAs | [ ] Eyebrow badge ("Singapore's Premier Baking Academy")<br>[ ] Main headline with gradient text<br>[ ] Decorative underline SVG<br>[ ] Subheading paragraph<br>[ ] Social proof (15,000+ students, 4.9 rating)<br>[ ] Two CTA buttons (Primary + Secondary)<br>[ ] Trust badges (Le Cordon Bleu, etc.)<br>[ ] Hero image with floating card overlay<br>[ ] Floating stats cards with animation<br>[ ] Reduced motion support |

**Design Specifications:**
- Grid: `lg:grid-cols-2` with asymmetric spacing
- Hero image: `aspect-[4/5]` with `rounded-3xl`
- Floating cards: Absolute positioned with `animate-float`

### 5.2 Trust Bar

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/sections/TrustBar.tsx` | Create | Dark background feature highlights | [ ] 4-column grid<br>[ ] Icons for each feature<br>[ ] HD Video Lessons<br>[ ] Lifetime Access<br>[ ] Community Forum<br>[ ] Certificates |

**Design Specifications:**
- Background: `bg-crust-900`
- Icons: `w-12 h-12` with `bg-crust-800` container
- Text: `text-crust-100` for headings

### 5.3 Featured Products (Course Cards)

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/sections/FeaturedProducts.tsx` | Create | Bento grid with course cards | [ ] Section header with badge<br>[ ] Bento grid layout (featured spans 2×2)<br>[ ] Course cards with images<br>[ ] Level badges (Beginner/Intermediate/Advanced)<br>[ ] Sale badges<br>[ ] Duration, lesson count, ratings<br>[ ] Pricing (current + strikethrough original)<br>[ ] CTA buttons<br>[ ] Hover lift animation |

**Props Interface:**
```typescript
interface FeaturedProductsProps {
  products: ProductWithCategory[];
}
```

**Bento Grid Behavior:**
- Mobile: Single column
- Desktop: 3 columns with featured spanning 2 columns and 2 rows

### 5.4 Free Guide CTA

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/sections/FreeGuideCTA.tsx` | Create | High-conversion email opt-in | [ ] Dark gradient background<br>[ ] Feature checklist with icons<br>[ ] Email input form<br>[ ] Book mockup visual<br>[ ] Floating "FREE" badge<br>[ ] Form validation<br>[ ] Submit loading state<br>[ ] Success feedback |

**Form Requirements:**
- Email validation
- Loading state on submit
- Success message animation
- Privacy policy link

### 5.5 Instructors Section

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/sections/InstructorsSection.tsx` | Create | Editorial portrait cards | [ ] Section header<br>[ ] 3-column grid (responsive)<br>[ ] Instructor cards with photos<br>[ ] Gradient overlay on images<br>[ ] Name and credentials<br>[ ] Skill tags |

### 5.6 Testimonials Section

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/sections/TestimonialsSection.tsx` | Create | Quote cards with ratings | [ ] Section header<br>[ ] 3-column grid<br>[ ] Testimonial cards with quote marks<br>[ ] 5-star rating display<br>[ ] Author avatar + name + location<br>[ ] Background color variation |

### 5.7 Final CTA Section

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/sections/FinalCTA.tsx` | Create | Closing call-to-action | [ ] Centered text layout<br>[ ] Main headline<br>[ ] Subheading text<br>[ ] Two CTA buttons<br>[ ] Trust badges (30-day guarantee, etc.) |

---

## Phase 6: Storefront Pages

**Objective:** Implement public-facing pages with data fetching.

**Estimated Duration:** 3-4 days

### 6.1 Homepage

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/(store)/page.tsx` | Create | Landing page composition | [ ] Server Component data fetching<br>[ ] Header inclusion<br>[ ] All section components composed<br>[ ] Footer inclusion<br>[ ] Metadata for SEO<br>[ ] Loading states |

**Data Fetching:**
```typescript
async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isAvailable: true },
    take: 5,
    include: { category: true }
  });
}
```

### 6.2 Shop Page (Product Listing)

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/(store)/shop/page.tsx` | Create | Product grid with filtering | [ ] All products display<br>[ ] Category filtering<br>[ ] Price sorting<br>[ ] Search functionality<br>[ ] Pagination or infinite scroll<br>[ ] Empty state |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/shop/ProductGrid.tsx` | Create | Reusable product grid | [ ] Responsive grid (1-4 columns)<br>[ ] Product card component<br>[ ] Loading skeleton |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/shop/ProductCard.tsx` | Create | Individual product card | [ ] Product image<br>[ ] Name and category<br>[ ] Price display<br>[ ] Add to cart button<br>[ ] Stock status |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/shop/FilterSidebar.tsx` | Create | Category and price filters | [ ] Category checkboxes<br>[ ] Price range slider<br>[ ] Clear filters button |

### 6.3 Product Detail Page

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/(store)/shop/[slug]/page.tsx` | Create | Individual product display | [ ] Product images gallery<br>[ ] Product name and description<br>[ ] Price with GST breakdown<br>[ ] Stock status<br>[ ] Quantity selector<br>[ ] Add to cart button<br>[ ] Reviews section<br>[ ] Related products<br>[ ] Metadata generation |

**Params Interface:**
```typescript
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}
```

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/product/ProductGallery.tsx` | Create | Image gallery with zoom | [ ] Main image display<br>[ ] Thumbnail navigation<br>[ ] Image zoom on hover |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/product/AddToCartButton.tsx` | Create | Interactive cart button | [ ] Quantity selector<br>[ ] Stock validation<br>[ ] Loading state<br>[ ] Success feedback |

### 6.4 Cart Page

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/(store)/cart/page.tsx` | Create | Shopping cart display | [ ] Cart items list<br>[ ] Quantity adjustment<br>[ ] Item removal<br>[ ] Price calculations (subtotal, GST, total)<br>[ ] Empty cart state<br>[ ] Continue shopping link<br>[ ] Checkout button |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/cart/CartItem.tsx` | Create | Individual cart item row | [ ] Product image thumbnail<br>[ ] Product name<br>[ ] Unit price<br>[ ] Quantity controls<br>[ ] Line total<br>[ ] Remove button |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/cart/CartSummary.tsx` | Create | Order summary sidebar | [ ] Subtotal<br>[ ] GST calculation<br>[ ] Shipping estimate<br>[ ] Total<br>[ ] Checkout CTA |

---

## Phase 7: Checkout & Payments

**Objective:** Implement secure checkout flow with Stripe integration.

**Estimated Duration:** 3-4 days

### 7.1 Checkout API Route

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/api/checkout/route.ts` | Create | Payment intent creation | [ ] Rate limiting (5 req/15min)<br>[ ] Zod input validation<br>[ ] User authentication (optional)<br>[ ] Stock availability check<br>[ ] Row-level locking for inventory<br>[ ] Order creation in transaction<br>[ ] Stripe Payment Intent creation<br>[ ] GST calculation<br>[ ] Error handling |

**Request Schema:**
```typescript
const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive().max(99),
  })).min(1),
  shippingAddress: z.object({
    line1: z.string().min(1).max(100),
    line2: z.string().max(100).optional(),
    city: z.string().min(1).max(50),
    postalCode: z.string().length(6), // Singapore format
    country: z.literal('SG'),
  }),
  customerEmail: z.string().email(),
  customerName: z.string().min(1).max(100),
  customerPhone: z.string().regex(/^[0-9]{8}$/).optional(),
});
```

### 7.2 Stripe Webhook

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/api/webhooks/stripe/route.ts` | Create | Payment confirmation handling | [ ] Webhook signature verification<br>[ ] Payment intent succeeded handler<br>[ ] Order status update<br>[ ] Inventory decrement<br>[ ] Email notification trigger |

### 7.3 Checkout Page

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/(store)/checkout/page.tsx` | Create | Checkout form with Stripe Elements | [ ] Shipping address form<br>[ ] Contact information<br>[ ] Stripe Payment Element<br>[ ] Order summary sidebar<br>[ ] Form validation<br>[ ] Error display |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/checkout/CheckoutForm.tsx` | Create | Stripe-integrated payment form | [ ] Stripe Elements provider<br>[ ] Address form fields<br>[ ] Payment submission handler<br>[ ] Loading states<br>[ ] Error messages |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/components/checkout/StripeProvider.tsx` | Create | Stripe context provider | [ ] Load Stripe instance<br>[ ] Appearance customization matching theme |

### 7.4 Order Confirmation

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/(store)/order/confirmation/page.tsx` | Create | Post-purchase confirmation | [ ] Order number display<br>[ ] Order summary<br>[ ] Next steps information<br>[ ] Continue shopping CTA |

---

## Phase 8: Admin Dashboard

**Objective:** Build protected admin interface for order and product management.

**Estimated Duration:** 3-4 days

### 8.1 Admin Layout

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/admin/layout.tsx` | Create | Protected admin layout | [ ] Authentication check<br>[ ] Admin sidebar navigation<br>[ ] Role-based access control<br>[ ] Redirect to login if unauthorized |

### 8.2 Admin Authentication

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/admin/login/page.tsx` | Create | Admin login page | [ ] Email/password form<br>[ ] Error handling<br>[ ] Redirect after login |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/api/auth/login/route.ts` | Create | Login API endpoint | [ ] Rate limiting<br>[ ] Credential validation<br>[ ] JWT creation<br>[ ] Cookie setting |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/api/auth/logout/route.ts` | Create | Logout API endpoint | [ ] Cookie removal<br>[ ] Redirect handling |

### 8.3 Admin Dashboard Home

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/admin/page.tsx` | Create | Dashboard overview | [ ] Stats cards (orders, revenue, products)<br>[ ] Recent orders list<br>[ ] Low stock alerts<br>[ ] Quick actions |

### 8.4 Order Management

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/admin/orders/page.tsx` | Create | Orders list view | [ ] Orders table with pagination<br>[ ] Status filtering<br>[ ] Date range filtering<br>[ ] Search by order number<br>[ ] Export functionality |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/admin/orders/[id]/page.tsx` | Create | Order detail view | [ ] Order information<br>[ ] Customer details<br>[ ] Order items list<br>[ ] Status update controls<br>[ ] Payment status display<br>[ ] Shipping address |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/api/admin/orders/[id]/route.ts` | Create | Order update API | [ ] Status update<br>[ ] Tracking number update<br>[ ] Admin authorization check |

### 8.5 Product Management

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/admin/products/page.tsx` | Create | Products list view | [ ] Products table<br>[ ] Stock status indicators<br>[ ] Quick actions (edit, delete)<br>[ ] Search and filter |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/admin/products/new/page.tsx` | Create | New product form | [ ] All product fields<br>[ ] Image upload<br>[ ] Category selection<br>[ ] Price and GST configuration<br>[ ] Stock quantity |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/admin/products/[id]/page.tsx` | Create | Edit product form | [ ] Pre-populated form<br>[ ] Image management<br>[ ] Update/delete actions |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/api/admin/products/route.ts` | Create | Products CRUD API | [ ] Create product<br>[ ] List products with filtering |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/api/admin/products/[id]/route.ts` | Create | Single product API | [ ] Get product<br>[ ] Update product<br>[ ] Delete product |

---

## Phase 9: Cart State Management

**Objective:** Implement client-side cart with server persistence.

**Estimated Duration:** 2 days

### 9.1 Cart Context

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/cart/CartContext.tsx` | Create | React context for cart state | [ ] Cart items state<br>[ ] Add to cart function<br>[ ] Remove from cart function<br>[ ] Update quantity function<br>[ ] Clear cart function<br>[ ] Persist to localStorage<br>[ ] Sync with server for authenticated users |

**CartItem Interface:**
```typescript
interface CartItem {
  productId: string;
  name: string;
  price: number; // in cents
  quantity: number;
  image: string;
}
```

### 9.2 Cart Hook

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/hooks/useCart.ts` | Create | Convenience hook for cart | [ ] Returns cart context<br>[ ] Memoized selectors for totals |

---

## Phase 10: Testing & Quality Assurance

**Objective:** Comprehensive testing across all layers.

**Estimated Duration:** 3-4 days

### 10.1 Unit Tests

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/__tests__/gst-calculator.test.ts` | Create | GST calculation tests | [ ] Basic 9% calculation<br>[ ] Edge cases (zero, negative)<br>[ ] Integer arithmetic verification |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/lib/__tests__/auth.test.ts` | Create | Auth utility tests | [ ] Password hashing<br>[ ] Token creation/verification<br>[ ] Cookie handling |

### 10.2 Integration Tests

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `src/app/api/__tests__/checkout.test.ts` | Create | Checkout API tests | [ ] Successful payment flow<br>[ ] Stock validation<br>[ ] Rate limiting<br>[ ] Error handling |

### 10.3 E2E Tests

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `tests/e2e/homepage.spec.ts` | Create | Homepage flow tests | [ ] Page load<br>[ ] Navigation<br>[ ] Mobile menu |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `tests/e2e/checkout.spec.ts` | Create | Checkout flow tests | [ ] Add to cart<br>[ ] Checkout process<br>[ ] Payment completion |

### 10.4 Accessibility Audit

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `tests/a11y/axe.spec.ts` | Create | Automated accessibility tests | [ ] axe-core integration<br>[ ] WCAG AA validation<br>[ ] Keyboard navigation tests |

---

## Phase 11: Deployment & DevOps

**Objective:** Production deployment configuration.

**Estimated Duration:** 2 days

### 11.1 Production Configuration

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `next.config.ts` | Create | Next.js production config | [ ] Output: standalone<br>[ ] Image optimization config<br>[ ] Environment variables validation |

### 11.2 CI/CD

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `.github/workflows/ci.yml` | Create | GitHub Actions CI | [ ] Type checking<br>[ ] Linting<br>[ ] Unit tests<br>[ ] Build verification |

| File | Action | Features & Interfaces | Checklist |
|------|--------|----------------------|-----------|
| `.github/workflows/deploy.yml` | Create | Deployment workflow | [ ] Docker build and push<br>[ ] Database migration<br>[ ] Health check |

---

## Complete File Inventory

### Configuration Files (14 files)
1. `package.json`
2. `tsconfig.json`
3. `.env.example`
4. `docker-compose.yml`
5. `Dockerfile`
6. `.dockerignore`
7. `vite.config.ts`
8. `next.config.ts`
9. `prisma/schema.prisma`
10. `prisma/seed.ts`
11. `.github/workflows/ci.yml`
12. `.github/workflows/deploy.yml`
13. `.gitignore`
14. `README.md`

### Library/Utility Files (8 files)
1. `src/lib/prisma.ts`
2. `src/lib/auth.ts`
3. `src/lib/gst-calculator.ts`
4. `src/lib/rate-limit.ts`
5. `src/lib/validation.ts`
6. `src/lib/hooks/useReducedMotion.ts`
7. `src/lib/hooks/useCart.ts`
8. `src/lib/cart/CartContext.tsx`

### Layout Components (6 files)
1. `src/app/layout.tsx`
2. `src/app/(store)/layout.tsx`
3. `src/app/admin/layout.tsx`
4. `src/components/layout/Header.tsx`
5. `src/components/layout/MobileNav.tsx`
6. `src/components/layout/Footer.tsx`

### Section Components (7 files)
1. `src/components/sections/HeroSection.tsx`
2. `src/components/sections/TrustBar.tsx`
3. `src/components/sections/FeaturedProducts.tsx`
4. `src/components/sections/FreeGuideCTA.tsx`
5. `src/components/sections/InstructorsSection.tsx`
6. `src/components/sections/TestimonialsSection.tsx`
7. `src/components/sections/FinalCTA.tsx`

### Shop Components (6 files)
1. `src/components/shop/ProductGrid.tsx`
2. `src/components/shop/ProductCard.tsx`
3. `src/components/shop/FilterSidebar.tsx`
4. `src/components/product/ProductGallery.tsx`
5. `src/components/product/AddToCartButton.tsx`
6. `src/components/cart/CartItem.tsx`
7. `src/components/cart/CartSummary.tsx`

### Checkout Components (3 files)
1. `src/components/checkout/CheckoutForm.tsx`
2. `src/components/checkout/StripeProvider.tsx`

### Admin Components (4 files)
1. `src/components/admin/StatsCards.tsx`
2. `src/components/admin/OrdersTable.tsx`
3. `src/components/admin/ProductsTable.tsx`
4. `src/components/admin/ProductForm.tsx`

### Pages — Storefront (6 files)
1. `src/app/(store)/page.tsx`
2. `src/app/(store)/shop/page.tsx`
3. `src/app/(store)/shop/[slug]/page.tsx`
4. `src/app/(store)/cart/page.tsx`
5. `src/app/(store)/checkout/page.tsx`
6. `src/app/(store)/order/confirmation/page.tsx`

### Pages — Admin (5 files)
1. `src/app/admin/login/page.tsx`
2. `src/app/admin/page.tsx`
3. `src/app/admin/orders/page.tsx`
4. `src/app/admin/orders/[id]/page.tsx`
5. `src/app/admin/products/page.tsx`
6. `src/app/admin/products/new/page.tsx`
7. `src/app/admin/products/[id]/page.tsx`

### API Routes — Auth (2 files)
1. `src/app/api/auth/login/route.ts`
2. `src/app/api/auth/logout/route.ts`

### API Routes — Store (3 files)
1. `src/app/api/checkout/route.ts`
2. `src/app/api/webhooks/stripe/route.ts`
3. `src/app/api/cart/sync/route.ts`

### API Routes — Admin (2 files)
1. `src/app/api/admin/orders/[id]/route.ts`
2. `src/app/api/admin/products/route.ts`
3. `src/app/api/admin/products/[id]/route.ts`

### Test Files (5+ files)
1. `src/lib/__tests__/gst-calculator.test.ts`
2. `src/lib/__tests__/auth.test.ts`
3. `src/app/api/__tests__/checkout.test.ts`
4. `tests/e2e/homepage.spec.ts`
5. `tests/e2e/checkout.spec.ts`
6. `tests/a11y/axe.spec.ts`

**Total: ~70+ files**

---

## Execution Order & Dependencies

```
Phase 1 (Foundation)
├── package.json
├── tsconfig.json
├── Docker files
├── Tailwind CSS globals.css
└── Vite config

Phase 2 (Database)
├── Prisma schema
├── Migration files
├── Seed script
└── Prisma client lib

Phase 3 (Utilities)
├── GST calculator
├── Auth utilities
├── Rate limiting
└── Validation schemas

Phase 4 (Layout)
├── Root layout
├── Header
├── MobileNav
└── Footer

Phase 5 (Sections - can parallelize)
├── HeroSection
├── TrustBar
├── FeaturedProducts
├── FreeGuideCTA
├── InstructorsSection
├── TestimonialsSection
└── FinalCTA

Phase 6 (Storefront Pages)
├── Homepage (uses all sections)
├── Shop page
├── Product detail
└── Cart page

Phase 7 (Checkout)
├── Checkout API
├── Stripe webhook
├── Checkout page
└── Confirmation page

Phase 8 (Admin)
├── Admin layout
├── Admin auth
├── Dashboard
├── Orders management
└── Products management

Phase 9 (Cart State)
└── CartContext + useCart

Phase 10 (Testing)
└── All test files

Phase 11 (Deployment)
└── CI/CD + production config
```

---

## Validation Checklist

### Pre-Implementation
- [ ] All design tokens from `design_guide.md` mapped to Tailwind v4
- [ ] Database schema reviewed for PDPA compliance
- [ ] Stripe account configured with webhook endpoint
- [ ] Environment variables documented

### Per-Phase Validation
- [ ] Each phase builds without errors
- [ ] TypeScript strict mode passes
- [ ] Visual regression testing against static mockup

### Final Validation
- [ ] All checkboxes in this document marked complete
- [ ] Lighthouse scores >90 across all categories
- [ ] Security audit passed
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Payment flow tested with Stripe test mode
- [ ] Mobile responsiveness verified (360px - 1920px)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

---

## Post-Implementation Roadmap

### Immediate (Week 1-2)
1. Replace Unsplash placeholders with actual photography
2. Connect email forms to ESP (Mailchimp/ConvertKit)
3. Add Course JSON-LD schema for SEO rich snippets
4. Implement GA4 tracking with conversion events

### Short-Term (Month 1-2)
1. Video trailer modal with Vimeo/YouTube integration
2. Student dashboard for course progress tracking
3. Blog/Journal section with MDX support
4. Advanced search with Algolia

### Long-Term (Quarter 2+)
1. Multi-language support (English/Chinese)
2. Membership subscription tiers
3. Live class scheduling and booking
4. Instructor application portal

---

## Document Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-31 | Initial comprehensive plan |

---

**END OF MASTER EXECUTION PLAN**
