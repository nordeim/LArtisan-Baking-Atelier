<img width="1524" height="975" alt="image" src="https://github.com/user-attachments/assets/ade4862e-76af-4d7b-b051-5eacf8302b5d" />

<div align="center">

# 🥐 L'Artisan Baking Atelier

### *Singapore's Premier Artisan Baking School E-Commerce Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Live Demo](#) · [Documentation](#documentation) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [User Flow](#user-flow)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**L'Artisan Baking Atelier** is a full-stack e-commerce platform built for an artisan baking school in Singapore. The platform enables students to discover, purchase, and access premium baking courses with a seamless, secure checkout experience.

### Key Highlights

- 🎨 **Avant-Garde Design** - Tailwind CSS v4 with custom "Édition Boulangerie" design system
- 💳 **Secure Payments** - Stripe integration with Singapore GST (9%) compliance
- 🛒 **Smart Cart** - Persistent cart with localStorage, cross-tab sync
- 📱 **Mobile-First** - Responsive design optimized for all devices
- 🔒 **PDPA Compliant** - Singapore data protection compliance built-in
- 🧪 **Well Tested** - 84+ unit tests + E2E tests with Vitest & Playwright
- 🎛️ **Admin Dashboard** - Full CRUD for orders and products
- 👤 **User Dashboard** - Order history, course access, profile management
- 📊 **Progress Tracking** - Student progress dashboard with gamification
- 🎥 **Video Platform** - Course video lessons with resume capability
- 📈 **SEO Optimized** - JSON-LD structured data, sitemap, meta tags
- 📊 **GA4 Analytics** - E-commerce tracking with conversion events
- 🚀 **Production Ready** - CI/CD, monitoring, automated backups
- 📧 **Email Service** - Transactional emails with Resend
- 🐛 **Error Tracking** - Sentry integration for monitoring

---

## ✨ Features

### Storefront
- 🏠 **Dynamic Homepage** - Hero section, featured products, testimonials
- 🔍 **Product Catalog** - Filter by category, sort by price/name
- 📦 **Product Detail** - Image gallery, curriculum preview, reviews
- 🛍️ **Shopping Cart** - Real-time updates, quantity management
- 👤 **Customer Portal** - Account dashboard, order tracking, course access
- 📊 **Progress Dashboard** - Track learning progress, achievements, streaks
- 🎓 **Video Courses** - HD video lessons with progress tracking and resume
- 🏆 **Achievements** - Gamified badges for course completion milestones

### Checkout Experience
- 💰 **GST Calculation** - Automatic 9% Singapore GST computation
- 💳 **Stripe Payments** - Secure card processing with 3D Secure
- 📧 **Order Confirmation** - Email receipts and order tracking
- 👤 **Guest Checkout** - No account required to purchase

### Admin Capabilities
- 📊 **Order Management** - Track orders, update status, view details
- 📦 **Inventory Control** - Stock management with low-stock alerts
- 📝 **Product CRUD** - Create, edit, delete products with image management
- 📈 **Dashboard Analytics** - Revenue stats, order counts, low stock warnings
- 👥 **Customer Management** - View customer data (PDPA compliant)

### Technical Features
- ⚡ **Turbopack** - Fast development builds
- 🔐 **JWT Authentication** - Secure session management with Jose
- 📱 **PWA Ready** - Service worker support
- 🌐 **SEO Optimized** - Meta tags, structured data
- 🎓 **Digital Course Access** - Automatic enrollment on purchase
- 🔄 **CI/CD Pipeline** - GitHub Actions for testing & deployment
- 📊 **Monitoring** - Sentry error tracking & performance monitoring
- 💾 **Automated Backups** - Daily database backups to S3

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.4 | React framework with App Router |
| React | 19.0.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.0.0 | Utility-first styling |
| Framer Motion | 12.0.0 | Animations |
| Radix UI | 1.1.0 | Accessible primitives |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API | 16.1.4 | API routes |
| Prisma | 6.6.0 | ORM |
| PostgreSQL | 16 | Database |
| Stripe | 20.3.0 | Payments |
| Jose | 6.1.3 | JWT handling |
| Resend | latest | Transactional email |
| Sentry | latest | Error monitoring |

### DevOps & Infrastructure
| Tool | Purpose |
|------|---------|
| GitHub Actions | CI/CD pipeline |
| Docker Compose | Production orchestration |
| Nginx | Reverse proxy & SSL |
| AWS S3 | Backup storage |

### Development
| Tool | Purpose |
|------|---------|
| Vitest | Unit testing (84+ tests) |
| Playwright | E2E testing (4 test suites) |
| date-fns | Date formatting |
| ESLint | Code linting |
| Prettier | Code formatting |
| Docker | Containerization |

### CI/CD & Monitoring
| Workflow | Purpose |
|----------|---------|
| CI | Type check, lint, unit tests |
| E2E | Playwright tests with PostgreSQL |
| Deploy Staging | Auto-deploy to staging |
| Deploy Production | Production deployment with rollback |
| Backup | Automated daily database backups |

---

## 🏗️ Architecture

### High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Browser]
        B[Next.js App Router]
        C[React Components]
        D[Tailwind CSS]
    end

    subgraph "Server Layer"
        E[API Routes]
        F[Server Actions]
        G[Prisma ORM]
    end

    subgraph "Data Layer"
        H[PostgreSQL]
        I[localStorage]
    end

    subgraph "External Services"
        J[Stripe API]
        K[Email Service]
    end

    A --> B
    B --> C
    C --> D
    B --> E
    B --> F
    E --> G
    F --> G
    G --> H
    C --> I
    E --> J
    E --> K
```

### Application Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS
    participant API
    participant Stripe
    participant Database

    User->>Browser: Add to Cart
    Browser->>Browser: Update localStorage
    Browser->>Browser: Sync across tabs
    
    User->>Browser: Proceed to Checkout
    Browser->>NextJS: Submit customer info
    NextJS->>API: POST /api/checkout
    API->>Database: Validate stock
    API->>Database: Create order (PENDING)
    API->>Stripe: Create PaymentIntent
    Stripe-->>API: clientSecret
    API-->>NextJS: Return clientSecret
    NextJS-->>Browser: Stripe Elements
    
    User->>Browser: Enter card details
    Browser->>Stripe: confirmPayment()
    Stripe-->>Browser: Payment result
    
    Stripe->>API: POST /api/webhooks/stripe
    API->>Database: Update order (PAID)
    API->>Database: Decrement stock
    
    Browser->>NextJS: Redirect to success
    NextJS-->>User: Order confirmation
```

---

## 📁 Project Structure

```
LArtisan-Baking-Atelier/
├── 📂 src/
│   ├── 📂 app/                      # Next.js App Router
│   │   ├── 📂 (store)/              # Storefront route group
│   │   │   ├── 📂 shop/             # Product catalog
│   │   │   │   ├── 📄 page.tsx      # Shop listing page
│   │   │   │   └── 📂 [slug]/       # Product detail
│   │   │   │       └── 📄 page.tsx  # Dynamic product page
│   │   │   ├── 📂 checkout/         # Checkout flow
│   │   │   │   ├── 📄 page.tsx      # Checkout form
│   │   │   │   └── 📂 success/      # Order confirmation
│   │   │   │       └── 📄 page.tsx  # Success page
│   │   │   ├── 📂 account/          # Customer portal (protected)
│   │   │   │   ├── 📄 page.tsx      # Dashboard overview
│   │   │   │   ├── 📄 layout.tsx    # Protected layout with sidebar
│   │   │   │   ├── 📂 orders/       # Order history
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📂 courses/      # My courses access
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📂 profile/      # Profile & password
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📂 login/            # Customer login
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📂 register/         # Customer registration
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📂 forgot-password/  # Password reset request
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📂 reset-password/   # Password reset confirm
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📄 page.tsx          # Homepage
│   │   │   └── 📄 layout.tsx        # Store layout
│   │   ├── 📂 api/                  # API routes
│   │   │   ├── 📂 auth/             # Authentication
│   │   │   │   ├── 📂 login/        # POST: User login
│   │   │   │   ├── 📂 register/     # POST: User registration
│   │   │   │   ├── 📂 logout/       # GET/POST: Logout
│   │   │   │   ├── 📂 forgot-password/ # POST: Reset request
│   │   │   │   └── 📂 reset-password/  # POST: Reset confirm
│   │   │   ├── 📂 account/          # Customer APIs (protected)
│   │   │   │   ├── 📂 profile/      # GET/PATCH: Profile, POST: Password
│   │   │   │   ├── 📂 orders/       # GET: Order history
│   │   │   │   ├── 📂 courses/      # GET: Digital access
│   │   │   │   ├── 📂 progress/     # GET/POST: Progress tracking
│   │   │   │   └── 📂 progress/
│   │   │   │       └── 📂 overview/ # GET: Stats & streaks
│   │   │   ├── 📂 checkout/         # Payment intent
│   │   │   │   └── 📄 route.ts      # POST handler
│   │   │   └── 📂 webhooks/         # Stripe webhooks
│   │   │       └── 📂 stripe/
│   │   │           └── 📄 route.ts  # Webhook handler
│   │   ├── 📄 layout.tsx            # Root layout
│   │   └── 📄 globals.css           # Global styles
│   │
│   ├── 📂 components/               # React components
│   │   ├── 📂 ui/                   # shadcn/ui primitives
│   │   │   ├── 📄 button.tsx        # Button component
│   │   │   ├── 📄 card.tsx          # Card component
│   │   │   ├── 📄 input.tsx         # Input component
│   │   │   └── 📄 sheet.tsx         # Sheet/drawer
│   │   ├── 📂 layout/               # Layout components
│   │   │   ├── 📄 Header.tsx        # Site header
│   │   │   ├── 📄 Footer.tsx        # Site footer
│   │   │   └── 📄 MobileNav.tsx     # Mobile navigation
│   │   ├── 📂 sections/             # Homepage sections
│   │   │   ├── 📄 HeroSection.tsx   # Hero banner
│   │   │   ├── 📄 FeaturedProducts.tsx # Product grid
│   │   │   └── 📄 Testimonials.tsx  # Customer reviews
│   │   ├── 📂 shop/                 # Shop components
│   │   │   ├── 📄 ProductCard.tsx   # Product card
│   │   │   ├── 📄 ProductGrid.tsx   # Product grid
│   │   │   └── 📄 CategoryFilter.tsx # Category sidebar
│   │   ├── 📂 product/              # Product detail components
│   │   │   ├── 📄 ProductHero.tsx   # Image gallery
│   │   │   ├── 📄 ProductInfo.tsx   # Product metadata
│   │   │   └── 📄 AddToCartButton.tsx # Add to cart
│   │   ├── 📂 cart/                 # Cart components
│   │   │   ├── 📄 CartProvider.tsx  # Cart context
│   │   │   ├── 📄 CartDrawer.tsx    # Slide-out cart
│   │   │   ├── 📄 CartItem.tsx      # Cart line item
│   │   │   └── 📄 CartBadge.tsx     # Cart icon
│   │   ├── 📂 checkout/             # Checkout components
│   │   │   ├── 📄 CheckoutForm.tsx  # Customer form
│   │   │   ├── 📄 StripePaymentForm.tsx # Payment form
│   │   │   └── 📄 OrderSummary.tsx  # Order review
│   │   └── 📂 student/              # Student progress components
│   │       ├── 📄 CourseProgressCard.tsx # Progress card
│   │       ├── 📄 LessonList.tsx    # Lesson list
│   │       ├── 📄 AchievementBadge.tsx # Achievement badges
│   │       ├── 📄 StudyStreak.tsx   # Streak calendar
│   │       └── 📄 ProgressOverview.tsx # Stats dashboard
│   │
│   ├── 📂 lib/                      # Utility functions
│   │   ├── 📂 validation/           # Zod schemas
│   │   │   └── 📄 checkout.ts       # Checkout validation
│   │   ├── 📂 __tests__/            # Unit tests
│   │   │   ├── 📄 gst-calculator.test.ts
│   │   │   └── 📄 cart-utils.test.ts
│   │   ├── 📂 seo/                  # SEO utilities
│   │   │   ├── 📄 metadata.ts       # Meta tag helpers
│   │   │   └── 📄 json-ld.ts        # Structured data
│   │   ├── 📂 analytics/            # Analytics tracking
│   │   │   └── 📄 ga4.ts            # GA4 e-commerce
│   │   ├── 📄 utils.ts              # Common utilities
│   │   ├── 📄 prisma.ts             # Prisma client
│   │   ├── 📄 stripe.ts             # Stripe config
│   │   ├── 📄 auth.ts               # JWT authentication (server)
│   │   ├── 📄 auth-client.ts        # Auth helpers (client)
│   │   ├── 📄 cart-utils.ts         # Cart utilities
│   │   ├── 📄 gst-calculator.ts     # GST calculation
│   │   ├── 📄 shop.ts               # Product data fetching
│   │   └── 📄 navigation.ts         # Nav configuration
│   │
│   ├── 📂 hooks/                    # Custom React hooks
│   │   └── 📄 useCart.ts            # Cart hook
│   │
│   ├── 📂 types/                    # TypeScript types
│   │   └── 📄 cart.ts               # Cart type definitions
│   │
│   └── 📄 middleware.ts             # Next.js middleware
│
├── 📂 prisma/                       # Database schema
│   ├── 📄 schema.prisma             # Prisma schema
│   └── 📄 seed.ts                   # Database seeding
│
├── 📂 .github/                      # GitHub Actions workflows
│   └── 📂 workflows/
│       ├── 📄 ci.yml                # Continuous Integration
│       ├── 📄 e2e.yml               # E2E testing
│       ├── 📄 deploy-staging.yml    # Staging deployment
│       ├── 📄 deploy-production.yml # Production deployment
│       └── 📄 backup.yml            # Automated backups
│
├── 📂 docker/                       # Docker configuration
│   ├── 📄 Dockerfile
│   ├── 📄 docker-compose.yml        # Development
│   ├── 📄 docker-compose.prod.yml   # Production
│   └── 📄 docker-compose.override.yml
│
├── 📂 nginx/                        # Nginx configuration
│   ├── 📄 nginx.conf                # Reverse proxy config
│   └── 📄 proxy_params
│
├── 📂 public/                       # Static assets
│   └── 📂 images/                   # Product images
│
├── 📂 tests/                        # Test suites
│   ├── 📂 e2e/                      # Playwright E2E tests
│   │   ├── 📄 auth.spec.ts
│   │   ├── 📄 shop.spec.ts
│   │   ├── 📄 checkout.spec.ts
│   │   └── 📄 admin.spec.ts
│   └── 📂 a11y/                     # Accessibility tests
│
├── 📂 scripts/                      # Utility scripts
│   ├── 📄 backup-db.sh              # Database backup
│   └── 📄 restore-db.sh             # Database restore
│
├── 📄 .env.example                  # Development environment
├── 📄 .env.production.example       # Production environment
├── 📄 .env.staging.example          # Staging environment
├── 📄 next.config.ts                # Next.js config
├── 📄 vitest.config.ts              # Vitest config
├── 📄 playwright.config.ts          # Playwright config
├── 📄 sentry.client.config.ts       # Sentry client config
├── 📄 sentry.server.config.ts       # Sentry server config
├── 📄 sentry.edge.config.ts         # Sentry edge config
├── 📄 instrumentation.ts            # OpenTelemetry instrumentation
├── 📄 package.json
└── 📄 README.md                     # This file
```

---

## 👤 User Flow

### Customer Journey

```mermaid
flowchart TD
    A[🏠 Homepage] --> B{Authenticated?}
    B -->|No| C[Browse as Guest]
    B -->|Yes| D[👤 Account Dashboard]
    C --> E[🔍 Browse Courses]
    D --> E
    
    subgraph "🔐 Authentication"
        F[📝 Register] --> G[✉️ Verify Email]
        H[🔑 Login] --> D
        I[❓ Forgot Password] --> J[📧 Reset Email]
        J --> K[🔒 Reset Password]
        K --> H
    end
    
    E --> L[Filter by Category]
    L --> M[Sort by Price/Name]
    M --> N[📦 View Product]
    N --> O[Read Reviews]
    O --> P[Add to Cart 🛒]
    P --> Q{Continue Shopping?}
    Q -->|Yes| E
    Q -->|No| R[View Cart]
    R --> S[Adjust Quantity]
    S --> T[Proceed to Checkout]
    T --> U[📋 Enter Details]
    U --> V[💳 Payment]
    V --> W{Payment Success?}
    W -->|Yes| X[✅ Order Confirmed]
    W -->|No| Y[❌ Payment Failed]
    Y --> V
    X --> Z[📧 Email Receipt]
    X --> AA[📚 Access Course]
    
    subgraph "📊 Account Portal"
        D --> AB[📦 My Orders]
        D --> AC[🎓 My Courses]
        D --> AD[⚙️ Profile Settings]
        AB --> AE[View Order Details]
        AC --> AF[Watch Course Content]
        AD --> AG[Change Password]
    end
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher (or pnpm/yarn)
- **PostgreSQL** 16 (local or Docker)
- **Stripe Account** (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lartisan-baking-atelier.git
   cd lartisan-baking-atelier
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL (using Docker)
   docker-compose up -d db
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory for development:

```bash
cp .env.example .env.local
```

### Required Environment Variables

#### Core Application
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Database (PostgreSQL)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lartisan_db"
```

#### Authentication (JWT)
```env
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
```

#### Stripe Payments
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### Email Service (Resend)
```env
RESEND_API_KEY="re_..."
EMAIL_FROM="L'Artisan Baking Atelier <noreply@artisan-baking.com>"
```

#### Error Monitoring (Sentry - Optional for dev)
```env
SENTRY_DSN="https://..."
```

### Environment Templates

The project includes environment templates for different stages:

| File | Purpose |
|------|---------|
| `.env.example` | Development configuration |
| `.env.production.example` | Production secrets template |
| `.env.staging.example` | Staging environment template |

### Stripe Webhook Setup (Local Development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook secret to `.env.local`

---

## 🧪 Testing

### Run Unit Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Run E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts
```

### Test Coverage

| Module | Coverage | Tests |
|--------|----------|-------|
| GST Calculator | 100% | 43 tests |
| Cart Utilities | 100% | 41 tests |
| Authentication E2E | Core flows | auth.spec.ts |
| Shop E2E | Critical paths | shop.spec.ts |
| Checkout E2E | Payment flow | checkout.spec.ts |
| Admin E2E | Dashboard CRUD | admin.spec.ts |
| Student Progress | Component tests | Unit tested |
| **Total** | **Comprehensive** | **84+ unit + 4 E2E suites** |

---

## 🚢 Deployment

### Production Deployment (Docker)

1. **Configure environment variables**
   ```bash
   cp .env.production.example .env.production
   # Edit with your production values
   ```

2. **Build and deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
   ```

4. **Verify deployment**
   ```bash
   curl https://your-domain.com/api/health
   ```

### Infrastructure Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| Load Balancer | Nginx | SSL termination, rate limiting |
| Application | Next.js (2+ replicas) | Web server |
| Database | PostgreSQL 16 | Primary data store |
| Cache | Redis | Sessions & caching |
| Monitoring | Sentry | Error tracking |
| Email | Resend | Transactional emails |
| Backups | AWS S3 | Daily database backups |

### CI/CD Pipeline

The project includes automated CI/CD with GitHub Actions:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **CI** | PR & Push | Type check, lint, unit tests |
| **E2E** | PR & Push | Playwright E2E tests |
| **Deploy Staging** | Push to `develop` | Auto-deploy to staging |
| **Deploy Production** | Push to `main` | Production deployment |
| **Backup** | Daily 2 AM UTC | Database backups |

### Production Checklist

- [x] Set `NODE_ENV=production`
- [x] Configure CI/CD pipeline (GitHub Actions)
- [x] Set up production Docker Compose
- [x] Configure Nginx reverse proxy with SSL
- [x] Set up error monitoring (Sentry)
- [x] Configure email service (Resend)
- [x] Set up automated database backups
- [x] Configure GA4 analytics
- [x] Implement SEO optimization
- [ ] Configure production Stripe keys
- [ ] Set up production database
- [ ] Configure Stripe webhooks for production URL
- [ ] Set up SSL certificates
- [ ] Configure GitHub Secrets for deployment

---

## 📚 Documentation

### SEO & Structured Data

The project includes comprehensive SEO optimization:

| Feature | Location | Description |
|---------|----------|-------------|
| Metadata | `src/lib/seo/metadata.ts` | Centralized meta tag generation |
| JSON-LD | `src/lib/seo/json-ld.ts` | Structured data (7 schema types) |
| Sitemap | `src/app/sitemap.ts` | Dynamic XML sitemap generation |
| Robots | `src/app/robots.ts` | Search crawler configuration |

### Analytics & Tracking

GA4 e-commerce tracking is implemented for:
- Page views
- Add to cart events
- Begin checkout
- Purchase completions
- Course progress milestones

### Video Content Platform

Course video system with:
- Resume playback from last position
- Lesson completion tracking
- Progress percentage calculation
- Watch time analytics

### Student Progress System

Gamified learning experience:
- Visual progress indicators
- Achievement badges (5 rarity tiers)
- Study streaks with calendar heatmap
- Course completion certificates

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   ```
5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push and create a Pull Request**

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic formatting
- **Testing**: All new features require tests

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspiration from artisan bakeries worldwide
- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Hosted on [Vercel](https://vercel.com/)

---

<div align="center">

**[⬆ Back to Top](#-lartisan-baking-atelier)**

Made with ❤️ and 🥐 in Singapore

</div>
