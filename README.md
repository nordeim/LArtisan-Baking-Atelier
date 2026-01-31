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
- 🧪 **Well Tested** - 84+ unit tests with Vitest
- 🎛️ **Admin Dashboard** - Full CRUD for orders and products

---

## ✨ Features

### Storefront
- 🏠 **Dynamic Homepage** - Hero section, featured products, testimonials
- 🔍 **Product Catalog** - Filter by category, sort by price/name
- 📦 **Product Detail** - Image gallery, curriculum preview, reviews
- 🛍️ **Shopping Cart** - Real-time updates, quantity management

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
| Stripe | 17.0.0 | Payments |
| Jose | 5.9.0 | JWT handling |

### Development
| Tool | Purpose |
|------|---------|
| Vitest | Unit testing |
| Playwright | E2E testing |
| ESLint | Code linting |
| Prettier | Code formatting |
| Docker | Containerization |

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
│   │   │   ├── 📄 page.tsx          # Homepage
│   │   │   └── 📄 layout.tsx        # Store layout
│   │   ├── 📂 api/                  # API routes
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
│   │   └── 📂 checkout/             # Checkout components
│   │       ├── 📄 CheckoutForm.tsx  # Customer form
│   │       ├── 📄 StripePaymentForm.tsx # Payment form
│   │       └── 📄 OrderSummary.tsx  # Order review
│   │
│   ├── 📂 lib/                      # Utility functions
│   │   ├── 📂 validation/           # Zod schemas
│   │   │   └── 📄 checkout.ts       # Checkout validation
│   │   ├── 📂 __tests__/            # Unit tests
│   │   │   ├── 📄 gst-calculator.test.ts
│   │   │   └── 📄 cart-utils.test.ts
│   │   ├── 📄 utils.ts              # Common utilities
│   │   ├── 📄 prisma.ts             # Prisma client
│   │   ├── 📄 stripe.ts             # Stripe config
│   │   ├── 📄 cart-utils.ts         # Cart utilities
│   │   └── 📄 gst-calculator.ts     # GST calculation
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
├── 📂 docker/                       # Docker configuration
│   ├── 📄 Dockerfile
│   └── 📄 docker-compose.yml
│
├── 📂 public/                       # Static assets
│   └── 📂 images/                   # Product images
│
├── 📄 .env.example                  # Environment template
├── 📄 next.config.ts                # Next.js config
├── 📄 tailwind.config.ts            # Tailwind config
├── 📄 vitest.config.ts              # Vitest config
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
    B -->|Yes| D[Personalized View]
    C --> E[🔍 Browse Courses]
    D --> E
    E --> F[Filter by Category]
    F --> G[Sort by Price/Name]
    G --> H[📦 View Product]
    H --> I[Read Reviews]
    I --> J[Add to Cart 🛒]
    J --> K{Continue Shopping?}
    K -->|Yes| E
    K -->|No| L[View Cart]
    L --> M[Adjust Quantity]
    M --> N[Proceed to Checkout]
    N --> O[📋 Enter Details]
    O --> P[💳 Payment]
    P --> Q{Payment Success?}
    Q -->|Yes| R[✅ Order Confirmed]
    Q -->|No| S[❌ Payment Failed]
    S --> P
    R --> T[📧 Email Receipt]
    R --> U[📚 Access Course]
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

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lartisan_db"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Stripe (Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Stripe Webhook Setup (Local Development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook secret to `.env`

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
# Start dev server first
npm run dev

# Run Playwright tests
npx playwright test
```

### Test Coverage

| Module | Coverage |
|--------|----------|
| GST Calculator | 100% |
| Cart Utilities | 100% |
| **Total** | **84 tests passing** |

---

## 🚢 Deployment

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

### Vercel Deployment

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Configure environment variables**
4. **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production Stripe keys
- [ ] Set up production database
- [ ] Configure Stripe webhooks for production URL
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure email service

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
