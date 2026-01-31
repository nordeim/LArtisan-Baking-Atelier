# L'Artisan Baking Atelier - AI Agent Briefing Document

**Version:** 1.3.0
**Last Updated:** 2026-01-31
**Project Status:** Phases 1-9 Complete. Phase 10 (Testing & QA) In Progress.

---

## 1. Executive Summary

L'Artisan Baking Atelier is a full-stack e-commerce platform for an artisan baking school in Singapore. The platform is built with **Next.js 16.1.4**, **React 19**, **TypeScript 5.9**, **Tailwind CSS v4**, and **PostgreSQL 16**. It features a complete shopping cart, Stripe payment integration with Singapore GST compliance (9%), and a responsive, accessible UI.

**Current Status:**
- ✅ **Phases 1-9 Complete**: Foundation, Storefront, Cart, Checkout, Admin, and Cart State Management.
- 🏗️ **Phase 10 In Progress**: Testing & QA (84+ unit tests passing, E2E pending).
- ⏳ **Upcoming (Phase 12)**: User Dashboard (Account/Courses) - *Partially implemented in `src/app/(shop)/account` but requires theme alignment (OKLCH tokens).*

---

## 2. Standard Operating Procedure (The "Meticulous Approach")

**Role:** You are the **Frontend Architect & Avant-Garde UI Designer**.
**Philosophy:** **Anti-Generic**. Every interface must have a distinctive conceptual direction. No template aesthetics.

### Operational Workflow
1.  **ANALYZE**: Deep requirement mining. Never assume.
2.  **PLAN**: Structured execution roadmap with checklists.
3.  **VALIDATE**: Explicit confirmation before coding.
4.  **IMPLEMENT**: Modular, library-first (Shadcn/Radix), bespoke styling.
5.  **VERIFY**: Rigorous QA (Edge cases, Accessibility WCAG AAA, Performance).
6.  **DELIVER**: Complete handoff with knowledge transfer.

### Design Pledge
- **No "AI Slop":** Reject generic layouts.
- **Intentional Minimalism:** Whitespace is structural.
- **Deep Reasoning:** Justify every pixel.
- **Library Discipline:** Use `src/components/ui` (Shadcn/Radix) for primitives.

---

## 3. Architecture Overview

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
```

### Technology Versions (Locked)

| Technology | Version | Notes |
|------------|---------|-------|
| Next.js | 16.1.4 | App Router, Turbopack enabled |
| React | 19.0.0 | Concurrent features |
| TypeScript | 5.9.3 | Strict mode, no unchecked indexed access |
| Tailwind CSS | 4.0.0 | CSS-first configuration (`@theme` in `globals.css`) |
| Prisma | 6.6.0 | DECIMAL(10,4) for currency |
| Stripe | 20.3.0 | PaymentIntents API |
| Jose | 6.1.3 | JWT for Edge runtime |

---

## 4. Project Structure

```
src/
├── app/
│   ├── (store)/                    # Public Storefront
│   │   ├── page.tsx                # Homepage
│   │   ├── layout.tsx              # Store layout (Header/Footer)
│   │   ├── shop/                   # Product Catalog
│   │   ├── checkout/               # Stripe Checkout
│   │   └── ... (static pages)
│   ├── (shop)/                     # User Account & Auth (In Progress)
│   │   ├── login/                  # Customer Login
│   │   ├── register/               # Customer Registration
│   │   ├── account/                # User Dashboard (Theme alignment needed)
│   │   └── forgot-password/
│   ├── admin/                      # Admin Dashboard (Phase 8 Complete)
│   │   ├── (protected)/            # Auth-guarded routes
│   │   │   ├── orders/
│   │   │   └── products/
│   │   └── (public)/               # Admin Login
│   └── api/                        # API Routes
│       ├── checkout/               # Payment Intents
│       ├── webhooks/stripe/        # Stripe Events
│       └── health/                 # Health Check
│
├── components/
│   ├── ui/                         # Shadcn/Radix Primitives
│   ├── layout/                     # Header, Footer, MobileNav
│   ├── sections/                   # Homepage Sections (Hero, Features...)
│   ├── shop/                       # Product Cards, Grids, Filters
│   ├── product/                    # Product Detail (Gallery, Info, Reviews)
│   ├── cart/                       # Cart Logic & UI
│   └── checkout/                   # Stripe Forms
│
├── lib/
│   ├── utils.ts                    # Common utilities (cn, formatPrice)
│   ├── prisma.ts                   # Singleton Client
│   ├── auth.ts                     # JWT/Jose Auth
│   ├── cart-utils.ts               # Calculations (9% GST)
│   ├── gst-calculator.ts           # Singapore GST (9%) Logic
│   └── validation/                 # Zod Schemas
│
├── hooks/                          # Custom Hooks (useCart)
└── types/                          # TypeScript Definitions
```

---

## 5. Key Implementation Details

### 💰 Financial Calculations (Critical)
- **Currency:** SGD. Stored as **integers (cents)**.
- **GST:** Singapore GST **9%**.
- **Display:** GST-inclusive. `Subtotal = Total / 1.09`.
- **Reference:** `src/lib/gst-calculator.ts` (100% test coverage).

### 🛒 Cart System (Phase 9 Complete)
- **Persistence:** `localStorage` (`lartisan-cart`) with 30-min expiry.
- **Sync:** Cross-tab synchronization via `storage` event.
- **Provider:** `src/components/cart/CartProvider.tsx`.
- **Hook:** `src/hooks/useCart.ts`.

### 🔐 Authentication
- **User:** JWT (Jose) in HTTP-only `__Host-` cookies.
- **Strategy:** **Layout-Based Guards** (No `middleware.ts`).
    - Admin: Protected via `src/app/admin/(protected)/layout.tsx`.
    - Customer: Protected via page-level checks in `src/app/(shop)/account`.
- **Admin:** Separate login flow.
- **Guest:** Allowed for checkout.

### 🎨 Design System (Tailwind v4)
- **Colors:** OKLCH palette (`crust-50` to `crust-950`, `sage`).
- **Typography:** *Playfair Display* (Headings), *DM Sans* (Body).
- **Theme:** Defined in `src/app/globals.css`.

---

## 6. Recent Memories & Achievements

- **2026-01-31**: Validated Phase 9 (Cart State Management) as complete.
- **2026-01-31**: Identified theme token inconsistencies in `src/app/(shop)/account`.
- **2026-01-31**: Fixed `useSearchParams` Suspense boundaries in Next.js 16 build.
- **2026-01-31**: Confirmed Admin Dashboard functionality (Orders/Products CRUD).

---

## 7. Development Commands

```bash
# Start Dev Server (Turbopack)
npm run dev

# Database
npm run db:migrate    # Dev migration
npm run db:studio     # View data
npm run db:seed       # Seed defaults

# Testing
npm test              # Run Unit Tests (Vitest)
npm run test:e2e      # Run E2E (Playwright)

# Quality
npm run lint
npm run type-check
```

---

**End of Briefing**
