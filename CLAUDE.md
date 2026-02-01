# L'Artisan Baking Atelier - AI Agent Briefing Document

**Version:** 1.4.0  
**Last Updated:** 2026-02-01  
**Project Status:** Production Ready with Post-Launch Enhancements (Phases 1-11 Complete)

---

## Executive Summary

L'Artisan Baking Atelier is a full-stack e-commerce platform for an artisan baking school in Singapore. The platform is built with Next.js 16, React 19, TypeScript 5.9, Tailwind CSS v4, and PostgreSQL 16. It features a complete shopping cart, Stripe payment integration with Singapore GST compliance (9%), and a responsive, accessible UI.

**Current State:**
- ✅ **All Phases Complete** (Phases 1-11)
- ✅ 84+ passing unit tests + 4 E2E test suites
- ✅ Production build verified (46+ routes)
- ✅ TypeScript strict mode compliance
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Sentry error monitoring integrated
- ✅ Resend email service configured
- ✅ Automated database backups to S3
- ✅ GA4 Analytics with e-commerce tracking
- ✅ SEO optimization (meta tags, JSON-LD, sitemap)
- ✅ Video content platform with progress tracking
- ✅ Student progress dashboard with gamification

---

## Architecture Overview

### High-Level Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js 16 App Router                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Client     │  │     API      │  │   Server Actions     │  │
│  │  Components  │  │    Routes    │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│              Prisma ORM 6.6 + PostgreSQL 16                      │
│                      (Data Layer)                                │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      External Services                           │
│   Stripe (Payments)    │    Jose (JWT)    │    localStorage     │
└──────────────────────────────────────────────────────────────────┘
```

### Technology Versions (Locked)

| Technology | Version | Notes |
|------------|---------|-------|
| Next.js | 16.1.4 | App Router, Turbopack enabled |
| React | 19.0.0 | Concurrent features |
| TypeScript | 5.9.3 | Strict mode, no unchecked indexed access |
| Tailwind CSS | 4.0.0 | CSS-first configuration (@theme directive) |
| Prisma | 6.6.0 | ORM with PostgreSQL adapter |
| PostgreSQL | 16 | DECIMAL(10,4) for currency precision |
| Stripe | 20.3.0 | PaymentIntents API |
| Jose | 6.1.3 | JWT for Edge runtime |
| bcryptjs | 3.0.3 | Password hashing |
| Resend | latest | Transactional email service |
| Sentry | latest | Error monitoring & performance |
| Playwright | latest | E2E testing |
| date-fns | latest | Date formatting |
| GitHub Actions | N/A | CI/CD automation |

---

## Project Structure

```
src/
├── app/
│   ├── (shop)/                     # Storefront route group
│   │   ├── page.tsx                # Homepage with sections
│   │   ├── layout.tsx              # Store layout (Header/Footer/MobileNav)
│   │   ├── shop/
│   │   │   ├── page.tsx            # Product listing with filters/sort
│   │   │   └── [slug]/
│   │   │       ├── page.tsx        # Product detail page
│   │   │       └── not-found.tsx   # 404 for invalid products
│   │   ├── checkout/
│   │   │   ├── page.tsx            # Checkout with Stripe Elements
│   │   │   └── success/
│   │   │       └── page.tsx        # Order confirmation
│   │   ├── login/                  # Customer login
│   │   ├── register/               # Customer registration
│   │   ├── forgot-password/        # Password reset request
│   │   ├── reset-password/         # Password reset confirmation
│   │   └── account/                # Protected customer portal
│   │       ├── page.tsx            # Dashboard overview
│   │       ├── layout.tsx          # Protected layout with sidebar
│   │       ├── orders/             # Order history
│   │       ├── courses/            # My courses access
│   │       └── profile/            # Profile & password management
│   ├── admin/                      # Admin routes (route groups)
│   │   ├── (protected)/            # Protected admin routes
│   │   │   ├── layout.tsx          # Auth-check layout
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── orders/             # Order management
│   │   │   └── products/           # Product CRUD
│   │   └── (public)/               # Public admin routes
│   │       └── login/              # Admin login
│   ├── api/
│   │   ├── checkout/route.ts       # POST: Create payment intent
│   │   ├── webhooks/stripe/route.ts # POST: Handle Stripe webhooks
│   │   └── health/route.ts         # GET: Health check
│   └── global-error.tsx            # Global error boundary (Sentry)
│
├── components/
│   ├── ui/                         # shadcn/ui primitives (18 components)
│   │   ├── button.tsx, card.tsx, input.tsx, etc.
│   ├── layout/                     # Header, Footer, MobileNav
│   ├── sections/                   # Homepage sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── ... (7 total sections)
│   ├── shop/                       # Shop components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SortDropdown.tsx
│   │   ├── Pagination.tsx
│   │   └── EmptyState.tsx
│   ├── product/                    # Product detail components
│   │   ├── ProductHero.tsx         # Image gallery with zoom
│   │   ├── ProductInfo.tsx         # Price, rating, metadata
│   │   ├── ProductTabs.tsx         # Overview/Curriculum/Reviews
│   │   ├── CurriculumAccordion.tsx # Course lessons
│   │   ├── ReviewSection.tsx       # Reviews with ratings
│   │   ├── AddToCartButton.tsx     # Add to cart with states
│   │   ├── RelatedProducts.tsx     # Cross-sell grid
│   │   └── ShareButton.tsx         # Social sharing
│   ├── cart/                       # Cart components
│   │   ├── CartProvider.tsx        # React Context + persistence
│   │   ├── CartDrawer.tsx          # Slide-out cart (Sheet)
│   │   ├── CartItem.tsx            # Line item with quantity controls
│   │   ├── CartSummary.tsx         # Totals display
│   │   ├── CartBadge.tsx           # Header cart icon
│   │   └── EmptyCart.tsx           # Empty state
│   ├── checkout/                   # Checkout components
│   │   ├── CheckoutForm.tsx        # Customer details (React Hook Form)
│   │   ├── StripePaymentForm.tsx   # Stripe Elements payment
│   │   ├── OrderSummary.tsx        # Cart review sidebar
│   │   ├── CheckoutProgress.tsx    # Step indicator
│   │   └── EmptyCheckout.tsx       # Empty cart redirect
│   └── student/                    # Student progress components (Phase 11)
│       ├── CourseProgressCard.tsx  # Progress card with CTA
│       ├── LessonList.tsx          # Lesson list with completion
│       ├── AchievementBadge.tsx    # Gamification badges
│       ├── StudyStreak.tsx         # Streak calendar
│       ├── ProgressOverview.tsx    # Stats dashboard
│       └── ProgressRing.tsx        # Circular progress indicator
│
├── lib/
│   ├── validation/
│   │   └── checkout.ts             # Zod schemas for checkout
│   ├── __tests__/                  # Unit tests
│   │   ├── gst-calculator.test.ts  # 43 tests
│   │   ├── cart-utils.test.ts      # 41 tests
│   │   └── setup.ts                # Vitest setup
│   ├── utils.ts                    # Common utilities (cn, formatPrice, etc.)
│   ├── prisma.ts                   # Prisma client singleton
│   ├── stripe.ts                   # Stripe server/client config
│   ├── auth.ts                     # JWT authentication with Jose (server)
│   ├── auth-client.ts              # Client-side auth helpers
│   ├── cart-utils.ts               # Cart calculation functions
│   ├── gst-calculator.ts           # Singapore GST 9% calculations
│   ├── shop.ts                     # Product data fetching
│   ├── navigation.ts               # Nav items and helpers
│   ├── rate-limit.ts               # Rate limiting utility
│   ├── validation.ts               # Common Zod schemas
│   ├── email.ts                    # Resend email service
│   └── sentry.ts                   # Sentry utility functions
│
├── tests/
│   ├── e2e/                        # Playwright E2E tests
│   │   ├── auth.spec.ts            # Authentication flows
│   │   ├── shop.spec.ts            # Shopping experience
│   │   ├── checkout.spec.ts        # Checkout flow
│   │   └── admin.spec.ts           # Admin dashboard
│   └── a11y/                       # Accessibility tests
│
├── hooks/
│   └── useCart.ts                  # useCart hook for cart context
│
├── types/
│   └── cart.ts                     # Cart TypeScript definitions
│
├── middleware.ts                   # Next.js middleware (auth)
└── globals.css                     # Tailwind v4 CSS-first theme

prisma/
├── schema.prisma                   # Database schema (8 models)
└── seed.ts                         # Seed data (9 products, 3 categories)

public/
└── images/                         # Product images, logos
```

---

## Database Schema (Prisma)

### Models Overview

1. **User** - Customer accounts with PDPA compliance fields, password reset
2. **Account** - OAuth provider accounts
3. **Session** - User sessions
4. **Category** - Product categories
5. **Product** - Courses/products with DECIMAL(10,4) pricing
6. **Order** - Orders with Stripe integration
7. **OrderItem** - Line items with historical pricing snapshot
8. **Review** - Product reviews
9. **DigitalAccess** - Course enrollment tracking (granted on purchase)
10. **CourseLesson** - Video lessons for courses (Phase 11)
11. **LessonProgress** - Student lesson progress tracking (Phase 11)

### Key Schema Decisions

```prisma
// Currency precision for Singapore GST compliance
price          Decimal @db.Decimal(10, 4)  // Supports up to $999,999.9999
gstRate        Decimal @default(0.09) @db.Decimal(4, 4)

// Order status workflow
enum OrderStatus {
  PENDING     // Initial state
  CONFIRMED   // After successful payment
  PREPARING   // Being prepared
  READY       // Ready for pickup/delivery
  SHIPPED     // Shipped
  DELIVERED   // Delivered
  CANCELLED   // Cancelled
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

---

## Design System

### Color Palette (OKLCH)

Located in `src/globals.css` using Tailwind v4 `@theme` directive:

```css
/* Primary - Warm Browns (Crust palette) */
--color-crust-50: oklch(0.985 0.005 75);   /* Lightest background */
--color-crust-400: oklch(0.75 0.1 70);     /* Primary CTA - Buttery Gold */
--color-crust-800: oklch(0.3 0.06 50);     /* Espresso - Dark text */
--color-crust-900: oklch(0.2 0.04 45);     /* Dark Cocoa - Headings */

/* Accent - Sage Green */
--color-sage-400: oklch(0.75 0.06 130);

/* Semantic mapping */
--color-primary: var(--color-crust-400);
--color-background: var(--color-crust-50);
--color-foreground: var(--color-crust-900);
```

### Typography

```css
--font-display: "Playfair Display", Georgia, serif;  /* Headings */
--font-body: "DM Sans", system-ui, sans-serif;        /* Body text */
```

### Custom Utilities

```css
/* Card hover effect */
.card-lift:hover {
  @apply -translate-y-1.5;
  box-shadow: var(--shadow-card-hover);
}

/* Glass panel effect */
.glass-panel {
  @apply bg-crust-50/80 backdrop-blur-xl;
}
```

---

## Key Implementation Patterns

### 1. Cart State Management

**Location:** `src/components/cart/CartProvider.tsx`

```typescript
// Pattern: React Context + useReducer + localStorage
- Cart state persisted to localStorage with 30-min expiration
- Cross-tab sync via storage event listener
- GST-inclusive prices stored, subtotal calculated by dividing by 1.09
- All prices in cents (integers) to avoid floating-point errors
```

### 2. Payment Flow

**Files:** 
- `src/app/api/checkout/route.ts` - Create payment intent
- `src/app/api/webhooks/stripe/route.ts` - Handle webhooks
- `src/components/checkout/StripePaymentForm.tsx` - UI

```typescript
// Flow:
1. User submits checkout form
2. Frontend POST /api/checkout with customer info + cart items
3. API validates stock, calculates totals (subtotal + 9% GST)
4. API creates Stripe PaymentIntent
5. API creates Order in DB with status PENDING
6. API returns clientSecret
7. Frontend mounts Stripe Elements with clientSecret
8. User enters card details
9. Stripe.confirmPayment() called
10. Stripe webhook triggers on success
11. Webhook updates Order status to CONFIRMED
12. Webhook decrements product stock
```

### 3. GST Calculation

**Location:** `src/lib/cart-utils.ts`

```typescript
// GST is 9% Singapore rate
// Prices stored GST-inclusive (e.g., $49.00 includes GST)
// Subtotal = total / 1.09 (removes GST)
// GST amount = total - subtotal

Example:
  Price: $49.00 (4900 cents, GST-inclusive)
  Subtotal: 4900 / 1.09 = 4495 cents (GST-exclusive)
  GST: 4900 - 4495 = 405 cents
  Total: 4900 cents
```

### 4. Authentication

**Files:**
- `src/lib/auth.ts` - Server-side JWT utilities
- `src/lib/auth-client.ts` - Client-side auth helpers

```typescript
// JWT with Jose (Edge runtime compatible)
// HS256 signing algorithm
// 8-hour token expiration
// __Host- prefix cookie name for security
// httpOnly, secure, sameSite=strict flags

// Server-side usage:
const user = await requireAuth(request)  // Throws on unauthorized
const isAdmin = (user) => user.role === 'ADMIN'

// Client-side usage:
const user = await getCurrentUser()  // Returns null if not authenticated
const isUserAdmin = await isAdmin()

// Protected layout pattern:
// - Check cookie in layout.tsx (server)
// - Verify JWT with verifyToken()
// - Redirect to /login if missing/invalid
```

### 5. Digital Course Access

**Files:**
- `prisma/schema.prisma` - DigitalAccess model
- `src/app/api/webhooks/stripe/route.ts` - Grant access on payment
- `src/app/api/account/courses/route.ts` - Fetch user's courses

```typescript
// DigitalAccess model:
- Granted when payment webhook confirms order
- Tracks: grantedAt, lastAccessedAt, accessCount
- Stores: progress JSON for course completion
- Revocable: revokedAt field for refunds

// Flow:
1. Customer purchases course ( Stripe payment )
2. Webhook receives payment_intent.succeeded
3. Webhook creates DigitalAccess record
4. Customer views /account/courses
5. API returns active (non-revoked) access records
```

### 6. Data Fetching

**Pattern:** Server Components with Prisma

```typescript
// In page components (server-side):
const products = await prisma.product.findMany({...})

// In client components (account pages):
const response = await fetch('/api/account/orders')
const { orders } = await response.json()
```

---

## Testing Strategy

### Unit Tests (Vitest)

```
src/lib/__tests__/
├── gst-calculator.test.ts  # 43 tests - GST calculation edge cases
└── cart-utils.test.ts      # 41 tests - cart operations
```

**Run tests:**
```bash
npm test           # Run once
npm test -- --watch  # Watch mode
```

### E2E Tests (Playwright)

**Config:** `playwright.config.ts`

**Test Suites:**
| Suite | File | Coverage |
|-------|------|----------|
| Authentication | `auth.spec.ts` | Register, login, logout, password reset |
| Shop | `shop.spec.ts` | Product catalog, filtering, cart |
| Checkout | `checkout.spec.ts` | Payment flow, Stripe integration |
| Admin | `admin.spec.ts` | Dashboard, order/product management |

**Run tests:**
```bash
npm run test:e2e      # Headless
npm run test:e2e:ui   # With UI
npx playwright test --project=chromium  # Specific browser
```

---

## CI/CD Pipeline

### GitHub Actions Workflows

Located in `.github/workflows/`:

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI | `ci.yml` | PR & Push to main/develop | Type check, lint, unit tests, build |
| E2E | `e2e.yml` | PR & Push to main/develop | Playwright tests with PostgreSQL service |
| Deploy Staging | `deploy-staging.yml` | Push to `develop` | Auto-deploy to staging environment |
| Deploy Production | `deploy-production.yml` | Push to `main` | Production deployment with rollback |
| Backup | `backup.yml` | Daily 2 AM UTC | Automated database backups |

### Required GitHub Secrets

Configure these in repository settings:

```
SENTRY_DSN                    # Sentry project DSN
SENTRY_AUTH_TOKEN             # Sentry auth token for source maps
RESEND_API_KEY                # Resend API key
AWS_ACCESS_KEY_ID             # AWS access key for backups
AWS_SECRET_ACCESS_KEY         # AWS secret key
BACKUP_S3_BUCKET              # S3 bucket for backups
SLACK_WEBHOOK_URL             # (Optional) Slack notifications
```

---

## Error Monitoring (Sentry)

### Configuration Files

- `sentry.client.config.ts` - Browser error tracking with Session Replay
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime monitoring
- `instrumentation.ts` - OpenTelemetry registration
- `src/app/global-error.tsx` - Global error boundary UI

### Usage in Code

```typescript
import { reportError, setUser, addBreadcrumb } from '@/lib/sentry';

// Report an error
reportError(error, { context: 'checkout' });

// Set user context
setUser({ id: user.id, email: user.email });

// Add breadcrumb
addBreadcrumb('User clicked checkout', 'user-action');
```

---

## Email Service (Resend)

### Email Templates

Located in `src/lib/email.ts`:

| Template | Function | Trigger |
|----------|----------|---------|
| Order Confirmation | `sendOrderConfirmation()` | Payment success webhook |
| Password Reset | `sendPasswordResetEmail()` | Forgot password request |
| Welcome | `sendWelcomeEmail()` | New user registration |
| Order Status Update | `sendOrderStatusUpdate()` | Order status changes |

### Usage

```typescript
import { sendOrderConfirmation } from '@/lib/email';

await sendOrderConfirmation(customerEmail, {
  orderNumber: 'ORD-123',
  items: [...],
  subtotal: 4495,  // cents
  gstAmount: 405,  // cents
  total: 4900,     // cents
  customerName: 'John Doe',
});
```

---

## Database Backup & Restore

### Automated Backups

- **Schedule:** Daily at 2 AM UTC (GitHub Actions)
- **Destination:** AWS S3 with Intelligent-Tiering
- **Retention:** 30 days (configurable)
- **Format:** Compressed PostgreSQL custom format

### Manual Backup

```bash
# Run backup script
./scripts/backup-db.sh

# With custom options
DB_HOST=localhost DB_PASSWORD=secret ./scripts/backup-db.sh
```

### Restore from Backup

```bash
# List available backups
./scripts/restore-db.sh --list

# Restore specific backup
./scripts/restore-db.sh artisan_atelier_20240115_120000.sql.gz

# Restore from S3
./scripts/restore-db.sh -s artisan_atelier_latest.sql.gz
```

---

## Environment Variables

**Required for Development:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lartisan_db"

# JWT
JWT_SECRET="min-32-characters-required-for-security"

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # Get from stripe CLI

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Stripe Webhook Setup (Local):**
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy webhook signing secret to .env
```

---

## API Routes

### Public Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/checkout` | POST | Create payment intent, validate cart, create order |
| `/api/webhooks/stripe` | POST | Handle payment_intent.succeeded/failed |
| `/api/health` | GET | Health check endpoint |
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | User registration (auto-login) |
| `/api/auth/logout` | GET/POST | Clear auth cookie |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Confirm password reset |

### Protected Routes (Customer)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/account/profile` | GET | Get user profile |
| `/api/account/profile` | PATCH | Update profile (name, email) |
| `/api/account/profile` | POST | Change password |
| `/api/account/orders` | GET | Get order history |
| `/api/account/courses` | GET | Get digital course access |
| `/api/account/courses/[id]/progress` | GET/POST | Course progress & updates |
| `/api/account/progress` | GET | All course progress overview |
| `/api/account/progress` | POST | Update lesson progress |
| `/api/account/progress/overview` | GET | Dashboard stats & streaks |

---

## Known Constraints & Decisions

### Technical Constraints

1. **Prisma Version:** Locked at 6.6.0 (v7 had breaking config changes)
2. **Stripe API Version:** 2026-01-28.clover (locked)
3. **Node Version:** >= 20.0.0
4. **TypeScript:** Strict mode with `noUncheckedIndexedAccess: true`

### Business Logic Constraints

1. **Singapore GST:** Fixed at 9%, calculated on all products
2. **Digital Products:** No shipping address required (empty JSON in DB)
3. **Guest Checkout:** Orders can exist without User relation
4. **Stock Management:** Inventory decremented on webhook success (not checkout)

### Design Decisions

1. **Cart Persistence:** localStorage with 30-minute expiration
2. **Price Storage:** GST-inclusive prices in cents (integers)
3. **Image Handling:** Next.js Image component with remotePatterns
4. **Animation:** Framer Motion with prefers-reduced-motion support

---

## Common Tasks for AI Agents

### Adding a New Page

1. Create file in `src/app/(shop)/` or `src/app/admin/`
2. Use existing layout or create new route group
3. Follow TypeScript strict mode (no `any` types)
4. Add to navigation if needed in `src/lib/navigation.ts`

### Adding an Auth-Protected Page

1. Create page under `src/app/(shop)/account/[page]/`
2. Account layout (`layout.tsx`) handles auth check automatically
3. For client data fetching, use `/api/account/*` endpoints
4. Server Components can use `requireAuth()` from `lib/auth.ts`

### Adding a New Component

1. Create in appropriate folder under `src/components/`
2. Use `'use client'` directive if using hooks/browser APIs
3. Import UI primitives from `src/components/ui/`
4. Use Tailwind classes with design system tokens
5. Add TypeScript interfaces for all props

### Adding a Database Model

1. Edit `prisma/schema.prisma`
2. Run `npm run db:migrate` to create migration
3. Run `npm run db:generate` to generate client types
4. Update seed data in `prisma/seed.ts` if needed

### Adding an API Route

1. Create folder in `src/app/api/[route]/`
2. Create `route.ts` with exported handlers (GET, POST, etc.)
3. Use Zod for request validation
4. Return typed JSON responses
5. Add rate limiting for sensitive endpoints

### Adding a Form

1. Use React Hook Form with Zod resolver
2. Create validation schema in `src/lib/validation/`
3. Use shadcn/ui form components (Input, Label, etc.)
4. Handle loading and error states
5. Show Sonner toast notifications (installed but not fully integrated)

---

## Pending Work (Phases 8-10)

### Phase 8: Admin Dashboard ✅ COMPLETE
- [x] Admin authentication (JWT-based)
- [x] Protected route groups
- [x] Dashboard with stats
- [x] Order management (list, detail, status updates)
- [x] Product CRUD (create, read, update, delete)
- [x] Low stock alerts
- [x] Responsive admin sidebar

### Phase 9: User Dashboard & My Courses ✅ COMPLETE
- [x] Customer authentication (login/register/logout)
- [x] Protected `/account/*` routes with sidebar navigation
- [x] Dashboard with order stats and course count
- [x] Order history with detail modal
- [x] My Courses page (digital access listing)
- [x] Profile management (edit profile, change password)
- [x] Password reset flow (forgot/reset)
- [x] DigitalAccess model for course enrollment
- [x] Header account link integration

### Phase 10: Production Deployment ✅ COMPLETE
- [x] Production environment variables (`.env.production.example`)
- [x] Docker Compose production config (`docker-compose.prod.yml`)
- [x] CI/CD pipeline (GitHub Actions - 5 workflows)
- [x] Nginx reverse proxy configuration
- [x] Database backup strategy (automated to S3)
- [x] Monitoring (Sentry client/server/edge configs)
- [x] Email service integration (Resend with templates)
- [x] E2E test suite (4 comprehensive test files)

### Phase 11: Post-Launch Enhancements ✅ COMPLETE

#### 11.1 Content & Media Enhancement ✅
- [x] Asset guidelines document (`docs/ASSET_GUIDELINES.md`)
- [x] Image directory structure (`/public/images/courses/`, `/public/images/uploads/`)
- [x] Next.js image optimization config with AVIF/WebP support
- [x] Responsive image sizing strategy

#### 11.2 SEO & Analytics ✅
- [x] Centralized metadata system (`src/lib/seo/metadata.ts`)
- [x] JSON-LD structured data (`src/lib/seo/json-ld.ts`)
  - Organization schema
  - Product schema
  - Course schema
  - BreadcrumbList schema
  - FAQ schema
  - Review/Rating schema
  - LocalBusiness schema
- [x] Dynamic sitemap generation (`src/app/sitemap.ts`)
- [x] Robots.txt configuration (`src/app/robots.ts`)
- [x] GA4 integration with e-commerce tracking
  - Page view events
  - Add to cart events
  - Begin checkout events
  - Purchase events
  - Custom course progress events

#### 11.3 Video Content Platform ✅
- [x] `CourseLesson` model - Video lesson storage
  - title, description, videoUrl, thumbnailUrl
  - duration (seconds), order, isPreview
  - resources (JSON attachments)
- [x] `LessonProgress` model - Student progress tracking
  - progressPercent, currentTime (resume position)
  - completedAt, lastWatchedAt, watchCount
  - Unique constraint: userId + lessonId
- [x] Video player component with resume capability
- [x] Lesson completion tracking API

#### 11.4 Student Progress Dashboard ✅
- [x] Progress dashboard page (`/account/progress`)
- [x] Achievement showcase page (`/account/achievements`)
- [x] Course progress card component
  - Visual progress bar with percentage
  - Last accessed timestamp
  - Continue learning CTA
- [x] Lesson list component
  - Ordered lesson display
  - Completion checkmarks
  - Lock states for non-preview lessons
  - Duration display
- [x] Achievement badge system
  - 5 rarity tiers (bronze, silver, gold, platinum, special)
  - Unlock animations
  - Progress rings for in-progress achievements
- [x] Study streak component
  - Consecutive days counter
  - Calendar heatmap visualization
  - Longest streak record
- [x] Progress tracking API endpoints
  - `GET /api/account/progress` - All course progress
  - `POST /api/account/progress` - Update lesson progress
  - `GET /api/account/progress/overview` - Stats & streaks

---

## Debugging Tips

### Cart Issues
- Check localStorage for `lartisan-cart` key
- Verify 30-minute expiration hasn't passed
- Check browser console for storage events

### Payment Issues
- Verify Stripe keys are correct (test vs live)
- Check webhook secret is set correctly
- Look at Stripe Dashboard for failed payments
- Check server logs for webhook errors

### Database Issues
- Run `npm run db:reset` to clear and re-seed
- Check Prisma client is generated: `npm run db:generate`
- Verify DATABASE_URL is correct format

### Build Issues
- Run `npm run type-check` for TypeScript errors
- Check for unused imports/variables (strict mode)
- Ensure all Radix primitives are installed

---

## File Naming Conventions

- **Components:** PascalCase (e.g., `ProductCard.tsx`)
- **Utilities:** camelCase (e.g., `cart-utils.ts`)
- **Types:** camelCase with `.ts` extension (e.g., `cart.ts`)
- **Tests:** `[filename].test.ts` alongside source files
- **Routes:** `page.tsx`, `layout.tsx`, `route.ts`

---

## Code Style Guidelines

1. **TypeScript:** Strict mode - no `any`, proper type guards
2. **Imports:** Group by: React/Next → External → Internal → Relative
3. **CSS:** Tailwind classes preferred over custom CSS
4. **Components:** Function declarations over arrow functions for named exports
5. **Comments:** JSDoc for public APIs, inline for complex logic
6. **Error Handling:** Try/catch with specific error types, user-friendly messages

---

## Resources

- **Design System:** `static_html_mockup.html` (reference implementation)
- **Tailwind v4 Guide:** `TAILWIND_V4_0_COMPREHENSIVE_GUIDE.md`
- **Execution Plan:** `execution_draft_plan.md`
- **README:** `README.md` (user-facing documentation)

---

## Quick Reference

### Run Development Server
```bash
npm run dev  # Starts on http://localhost:3000 with Turbopack
```

### Database Operations
```bash
npm run db:migrate    # Create migration
npm run db:seed       # Seed data
npm run db:studio     # Open Prisma Studio
npm run db:reset      # Reset database
```

### Testing
```bash
npm test              # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
npm run test:e2e:ui   # E2E tests with UI
npm run type-check    # TypeScript check
npm run lint          # ESLint
```

### Build
```bash
npm run build         # Production build
npm start             # Start production server
```

### Production Deployment
```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

---

## Contact & Support

For questions about this codebase:
1. Check existing documentation in `/docs` folder
2. Review test files for usage examples
3. Check the AGENTS.md file for design philosophy

---

**End of Briefing Document**

*This document is a living reference. Update it as the project evolves.*
