# Phase 1: Foundation & Infrastructure — DETAILED SUB-PLAN

## 📋 Executive Overview

**Phase Objective:** Establish the complete project foundation with Docker infrastructure, Tailwind CSS v4 CSS-first theming, TypeScript configuration, and environment setup.

**Estimated Duration:** 2-3 days  
**Prerequisites:** Node.js 20+, Docker & Docker Compose, Git

**Success Criteria:**
- [ ] `npm install` completes without errors
- [ ] Docker containers start successfully (`docker-compose up`)
- [ ] Tailwind CSS v4 generates styles correctly
- [ ] TypeScript compilation passes (`tsc --noEmit`)
- [ ] All environment variables documented

---

## 🗂️ Task Breakdown

### TASK 1.1: Project Configuration Files

**Priority:** CRITICAL  
**Estimated Time:** 2-3 hours  
**Dependencies:** None

#### 1.1.1 TypeScript Configuration

| Property | Value | Rationale |
|----------|-------|-----------|
| `strict` | `true` | Maximum type safety |
| `target` | `ES2022` | Modern JavaScript features |
| `module` | `ESNext` | ESM support |
| `jsx` | `preserve` | Next.js handles JSX |
| `paths` | `@/*` → `./src/*` | Clean imports |

**File:** `tsconfig.json`

**Checklist:**
- [ ] Create `tsconfig.json` with strict mode enabled
- [ ] Configure path aliases (`@/*` → `src/*`)
- [ ] Set up `include` for `src/**/*` and `.next/types/**/*`
- [ ] Set up `exclude` for `node_modules`, `.next`, `dist`
- [ ] Enable `esModuleInterop` for CommonJS compatibility
- [ ] Enable `skipLibCheck` for faster builds
- [ ] Configure `isolatedModules` for Babel compatibility
- [ ] Add `forceConsistentCasingInFileNames` for cross-platform safety

**Validation:**
```bash
npx tsc --noEmit
# Expected: No errors
```

---

#### 1.1.2 Next.js Configuration

**File:** `next.config.ts`

**Required Configurations:**
- [ ] TypeScript type imports (`import type { NextConfig } from 'next'`)
- [ ] Standalone output for Docker deployment (`output: 'standalone'`)
- [ ] Image optimization configuration (remotePatterns for Unsplash)
- [ ] Environment variable validation
- [ ] Experimental features (if needed)

**Checklist:**
- [ ] Create `next.config.ts` (TypeScript config)
- [ ] Configure `output: 'standalone'` for Docker
- [ ] Add image domains: `images.unsplash.com`, `lh3.googleusercontent.com`
- [ ] Set `reactStrictMode: true`
- [ ] Configure `compress: true` for gzip
- [ ] Add trailing slash preference (if any)
- [ ] Configure redirects/rewrites (if needed)

---

#### 1.1.3 Environment Variables Template

**File:** `.env.example`

**Required Variables:**

```bash
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://artisan:secure_password@localhost:5432/artisan_atelier?schema=public"
DIRECT_URL="postgresql://artisan:secure_password@localhost:5432/artisan_atelier?schema=public"

# ============================================
# AUTHENTICATION (JWT)
# ============================================
# Generate with: openssl rand -base64 32
JWT_SECRET="your-256-bit-secret-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# REDIS (Rate Limiting & Caching)
# ============================================
REDIS_URL="redis://localhost:6379"

# ============================================
# STRIPE PAYMENTS
# ============================================
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ============================================
# APPLICATION
# ============================================
NODE_ENV="development"
PORT="3000"

# ============================================
# OPTIONAL: OAuth Providers
# ============================================
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
```

**Checklist:**
- [ ] Create `.env.example` with all required variables
- [ ] Add comments explaining each variable
- [ ] Include generation instructions for secrets
- [ ] Note which variables are required vs optional
- [ ] Add to `.gitignore`: `.env.local`, `.env.*.local`

**File:** `.env.local` (gitignored, created manually by developer)
- [ ] Copy from `.env.example`
- [ ] Fill in actual values
- [ ] Never commit to git

---

#### 1.1.4 Git Configuration

**File:** `.gitignore`

**Required Exclusions:**
```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Next.js
.next/
out/
dist/
*.tsbuildinfo
next-env.d.ts

# Environment
.env
.env.local
.env.*.local
!.env.example

# Database
*.db
*.db-journal

# Testing
coverage/
.nyc_output/
test-results/
playwright-report/
playwright/.cache/

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Docker volumes
docker-volumes/
postgres_data/
redis_data/
```

**Checklist:**
- [ ] Create comprehensive `.gitignore`
- [ ] Exclude all environment files except `.env.example`
- [ ] Exclude Next.js build output
- [ ] Exclude IDE files
- [ ] Exclude OS files
- [ ] Exclude Docker volume data

---

### TASK 1.2: Docker Infrastructure

**Priority:** CRITICAL  
**Estimated Time:** 3-4 hours  
**Dependencies:** Task 1.1

#### 1.2.1 Docker Compose Configuration

**File:** `docker-compose.yml`

**Services Required:**
1. **postgres** - PostgreSQL 16 database
2. **redis** - Redis 7 for caching/rate limiting
3. **app** - Next.js application

**Checklist:**

**PostgreSQL Service:**
- [ ] Image: `postgres:16-alpine`
- [ ] Container name: `artisan_db`
- [ ] Environment variables:
  - `POSTGRES_USER=artisan`
  - `POSTGRES_PASSWORD=${DB_PASSWORD}` (from .env)
  - `POSTGRES_DB=artisan_atelier`
- [ ] Volume: `postgres_data:/var/lib/postgresql/data`
- [ ] Port: `5432:5432`
- [ ] Health check:
  ```yaml
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U artisan"]
    interval: 5s
    timeout: 5s
    retries: 5
  ```
- [ ] Restart policy: `unless-stopped`

**Redis Service:**
- [ ] Image: `redis:7-alpine`
- [ ] Container name: `artisan_cache`
- [ ] Port: `6379:6379`
- [ ] Volume: `redis_data:/data`
- [ ] Command: `redis-server --appendonly yes`
- [ ] Restart policy: `unless-stopped`

**App Service:**
- [ ] Build context: `.`
- [ ] Dockerfile: `Dockerfile`
- [ ] Container name: `artisan_app`
- [ ] Port: `3000:3000`
- [ ] Environment variables from `.env`
- [ ] Dependencies:
  - `postgres` with condition `service_healthy`
  - `redis` with condition `service_started`
- [ ] Volume for hot reload (dev mode): `.:/app`
- [ ] Restart policy: `unless-stopped`

**Volumes:**
- [ ] `postgres_data:` (named volume)
- [ ] `redis_data:` (named volume)

**Networks:**
- [ ] `artisan_network:` (bridge network)

**Validation:**
```bash
docker-compose config
# Expected: Valid configuration output
```

---

#### 1.2.2 Production Dockerfile

**File:** `Dockerfile`

**Architecture:** Multi-stage build

**Stages:**
1. **deps** - Install dependencies
2. **builder** - Build the application
3. **runner** - Production runtime

**Checklist:**

**Base & Dependencies Stage:**
- [ ] Base image: `node:20-alpine`
- [ ] Install libc6-compat for Alpine
- [ ] Set working directory: `/app`
- [ ] Copy `package*.json`
- [ ] Install dependencies: `npm ci --only=production`

**Builder Stage:**
- [ ] Inherit from deps stage
- [ ] Copy all files
- [ ] Install dev dependencies
- [ ] Generate Prisma client
- [ ] Build Next.js: `npm run build`

**Runner Stage:**
- [ ] Base image: `node:20-alpine`
- [ ] Install dumb-init for proper signal handling
- [ ] Create non-root user: `nextjs`
- [ ] Set working directory: `/app`
- [ ] Copy `public/` folder
- [ ] Copy `.next/standalone/` folder
- [ ] Copy `.next/static/` to `.next/standalone/.next/static`
- [ ] Set proper permissions for `nextjs` user
- [ ] Switch to `nextjs` user
- [ ] Expose port 3000
- [ ] Set environment: `NODE_ENV=production`
- [ ] Command: `dumb-init node server.js`

**Security Checklist:**
- [ ] Use non-root user in production
- [ ] Multi-stage build to minimize image size
- [ ] Only copy necessary files to runner
- [ ] No dev dependencies in production image

**Validation:**
```bash
docker build -t artisan-test .
docker run -p 3000:3000 --env-file .env artisan-test
# Expected: App starts successfully
```

---

#### 1.2.3 Docker Ignore

**File:** `.dockerignore`

**Checklist:**
- [ ] Ignore `node_modules`
- [ ] Ignore `.git`
- [ ] Ignore `.env` files
- [ ] Ignore `.next` directory
- [ ] Ignore `dist` directory
- [ ] Ignore test files (`tests/`, `*.test.ts`)
- [ ] Ignore Docker files themselves
- [ ] Ignore CI/CD configs
- [ ] Ignore documentation

---

### TASK 1.3: Tailwind CSS v4 Configuration

**Priority:** CRITICAL  
**Estimated Time:** 4-5 hours  
**Dependencies:** Task 1.1

#### 1.3.1 PostCSS Configuration

**File:** `postcss.config.mjs`

**Checklist:**
- [ ] Create `postcss.config.mjs` (ESM format)
- [ ] Configure `@tailwindcss/postcss` plugin
- [ ] No additional plugins needed (Tailwind v4 handles everything)

**Configuration:**
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

---

#### 1.3.2 Global CSS with Tailwind v4 Theme

**File:** `src/app/globals.css`

**Structure:**
```css
@import "tailwindcss";

@theme {
  /* Theme variables */
}

@layer base {
  /* Base styles */
}

@layer utilities {
  /* Custom utilities */
}
```

**Checklist:**

**Theme Variables:**
- [ ] Import `tailwindcss` at the top
- [ ] Define `@theme` block

**Color Palette (OKLCH):**
- [ ] `--color-crust-50`: oklch(0.985 0.005 75)
- [ ] `--color-crust-100`: oklch(0.96 0.015 80)
- [ ] `--color-crust-200`: oklch(0.91 0.03 80)
- [ ] `--color-crust-300`: oklch(0.84 0.06 75)
- [ ] `--color-crust-400`: oklch(0.75 0.1 70) - Buttery Gold CTA
- [ ] `--color-crust-500`: oklch(0.65 0.12 65)
- [ ] `--color-crust-600`: oklch(0.55 0.1 60)
- [ ] `--color-crust-700`: oklch(0.45 0.08 55)
- [ ] `--color-crust-800`: oklch(0.3 0.06 50)
- [ ] `--color-crust-900`: oklch(0.2 0.04 45) - Dark Cocoa
- [ ] `--color-crust-950`: oklch(0.12 0.02 40)
- [ ] `--color-sage-400`: oklch(0.75 0.06 130)
- [ ] `--color-sage-500`: oklch(0.65 0.08 125)

**Typography:**
- [ ] `--font-display`: "Playfair Display", Georgia, serif
- [ ] `--font-body`: "DM Sans", system-ui, sans-serif

**Spacing:**
- [ ] `--spacing-18`: 4.5rem
- [ ] `--spacing-22`: 5.5rem
- [ ] `--spacing-30`: 7.5rem

**Shadows:**
- [ ] `--shadow-card`: 0 4px 20px -4px rgba(44, 24, 16, 0.08)
- [ ] `--shadow-card-hover`: 0 20px 40px -12px rgba(44, 24, 16, 0.15)
- [ ] `--shadow-elevated`: 0 25px 50px -12px rgba(44, 24, 16, 0.18)
- [ ] `--shadow-glow`: 0 0 60px -15px rgba(212, 165, 116, 0.4)

**Animations:**
- [ ] `--animate-fade-up`: fade-up 0.6s ease-out forwards
- [ ] `--animate-float`: float 6s ease-in-out infinite

**Keyframe Definitions:**
- [ ] `@keyframes fade-up` (opacity 0→1, translateY 20px→0)
- [ ] `@keyframes float` (translateY 0→-10px→0)

**Base Layer:**
- [ ] Set default border color: `--color-crust-200`
- [ ] Enable smooth scroll behavior
- [ ] Set body background: `bg-crust-50`
- [ ] Set body text color: `text-crust-900`
- [ ] Set body font family: `font-body`
- [ ] Set heading font family: `font-display`
- [ ] Custom scrollbar styling
- [ ] Selection styling (background: crust-400)
- [ ] Focus visible outline (2px solid crust-400)

**Utilities Layer:**
- [ ] `.text-balance` utility
- [ ] `.card-lift` utility (hover transform + shadow)
- [ ] `.gradient-text` utility
- [ ] `.glass-panel` utility (backdrop blur)

**Validation:**
```bash
npm run dev
# Check browser - styles should apply correctly
# Inspect element - should see OKLCH colors in computed styles
```

---

### TASK 1.4: Project Directory Structure

**Priority:** HIGH  
**Estimated Time:** 1 hour  
**Dependencies:** Task 1.1

**Directory Tree:**
```
/home/project/LArtisan-Baking-Atelier/
├── .github/
│   └── workflows/
├── docker/
│   └── postgres-init/        # Optional: custom init scripts
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── images/
│   └── fonts/                # If self-hosting fonts
├── src/
│   ├── app/
│   │   ├── (store)/          # Storefront route group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── shop/
│   │   │   ├── cart/
│   │   │   └── checkout/
│   │   ├── admin/            # Admin route group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   ├── orders/
│   │   │   └── products/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── checkout/
│   │   │   ├── webhooks/
│   │   │   └── admin/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── layout/           # Header, Footer, Navigation
│   │   ├── sections/         # Page sections (Hero, etc.)
│   │   ├── shop/             # Shop-related components
│   │   ├── product/          # Product detail components
│   │   ├── cart/             # Cart components
│   │   ├── checkout/         # Checkout components
│   │   └── admin/            # Admin components
│   ├── lib/
│   │   ├── __tests__/        # Unit tests
│   │   ├── hooks/            # Custom React hooks
│   │   ├── cart/             # Cart context
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── gst-calculator.ts
│   │   ├── rate-limit.ts
│   │   └── validation.ts
│   └── types/                # Global TypeScript types
├── tests/
│   ├── e2e/                  # Playwright tests
│   └── a11y/                 # Accessibility tests
├── .dockerignore
├── .env.example
├── .env.local                # gitignored
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts        # May not be needed for v4
├── tsconfig.json
└── vitest.config.ts
```

**Checklist:**
- [ ] Create all directories
- [ ] Add `.gitkeep` files to empty directories (optional)
- [ ] Verify directory structure matches Next.js App Router conventions

---

### TASK 1.5: Testing Framework Setup

**Priority:** MEDIUM  
**Estimated Time:** 1-2 hours  
**Dependencies:** Task 1.1

#### 1.5.1 Vitest Configuration

**File:** `vitest.config.ts`

**Checklist:**
- [ ] Import `defineConfig` from `vitest/config`
- [ ] Import `react` plugin from `@vitejs/plugin-react`
- [ ] Configure test environment: `jsdom`
- [ ] Setup files: `./src/lib/__tests__/setup.ts`
- [ ] Include pattern: `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`
- [ ] Exclude: `node_modules`, `.next`, `dist`
- [ ] Enable globals for describe/it/expect
- [ ] Configure coverage provider

**Validation:**
```bash
npm run test
# Expected: Vitest starts, no tests found (or passes if setup)
```

---

#### 1.5.2 Playwright Configuration

**File:** `playwright.config.ts`

**Checklist:**
- [ ] Define test directory: `./tests/e2e`
- [ ] Configure web server:
  - Command: `npm run dev`
  - Port: 3000
  - Reuse existing server option
- [ ] Configure projects:
  - Desktop Chrome
  - Desktop Firefox
  - Mobile Safari (iPhone)
  - Mobile Chrome (Pixel)
- [ ] Configure reporter: `html` + `list`
- [ ] Set workers: `process.env.CI ? 1 : undefined`
- [ ] Configure retries: `process.env.CI ? 2 : 0`

**Validation:**
```bash
npx playwright install
npm run test:e2e
# Expected: Playwright runs (may have no tests yet)
```

---

### TASK 1.6: ESLint & Prettier Configuration

**Priority:** MEDIUM  
**Estimated Time:** 1 hour  
**Dependencies:** Task 1.1

#### 1.6.1 ESLint Configuration

**File:** `eslint.config.mjs` (or `.eslintrc.json` for legacy)

**Checklist:**
- [ ] Extend Next.js ESLint config
- [ ] Configure TypeScript parser
- [ ] Add React Hooks rules
- [ ] Add import/order rules
- [ ] Configure ignore patterns

**Rules to Enable:**
- [ ] `@typescript-eslint/no-unused-vars`
- [ ] `@typescript-eslint/explicit-function-return-type` (optional)
- [ ] `react-hooks/rules-of-hooks`
- [ ] `react-hooks/exhaustive-deps`

#### 1.6.2 Prettier Configuration

**File:** `.prettierrc`

**Checklist:**
- [ ] Set `semi: true`
- [ ] Set `singleQuote: true`
- [ ] Set `tabWidth: 2`
- [ ] Set `trailingComma: 'es5'`
- [ ] Set `printWidth: 100`
- [ ] Configure plugins (if needed)

**File:** `.prettierignore`

- [ ] Ignore `node_modules`
- [ ] Ignore `.next`
- [ ] Ignore `dist`
- [ ] Ignore `package-lock.json`
- [ ] Ignore `prisma/migrations`

---

## ✅ Phase 1 Integration Checklist

### Pre-Flight Verification
- [ ] Node.js 20+ installed (`node --version`)
- [ ] Docker & Docker Compose installed (`docker --version`, `docker-compose --version`)
- [ ] Git repository initialized (`git status`)

### Configuration Files
- [ ] `package.json` updated with all dependencies
- [ ] `tsconfig.json` created with strict mode
- [ ] `next.config.ts` created with standalone output
- [ ] `.env.example` created with all variables documented
- [ ] `.gitignore` created with comprehensive exclusions
- [ ] `.dockerignore` created

### Docker Infrastructure
- [ ] `docker-compose.yml` created with all services
- [ ] `Dockerfile` created with multi-stage build
- [ ] Health checks configured for PostgreSQL
- [ ] Non-root user configured in Dockerfile
- [ ] Docker volumes defined for persistence

### Tailwind CSS v4
- [ ] `postcss.config.mjs` created
- [ ] `src/app/globals.css` created with `@import "tailwindcss"`
- [ ] `@theme` block with OKLCH colors defined
- [ ] Font families configured (Playfair Display, DM Sans)
- [ ] Custom spacing values added
- [ ] Shadow tokens defined
- [ ] Animation keyframes created
- [ ] Base layer with resets and typography
- [ ] Custom utilities layer with helpers

### Testing Setup
- [ ] `vitest.config.ts` created
- [ ] `playwright.config.ts` created
- [ ] Test directory structure created

### Code Quality
- [ ] ESLint configured
- [ ] Prettier configured
- [ ] `.prettierignore` created

### Directory Structure
- [ ] All directories created per structure above
- [ ] Empty directories have `.gitkeep` if needed

### Validation Commands (Run These)
```bash
# 1. Install dependencies
npm install
# Expected: No errors, all packages installed

# 2. Type checking
npm run type-check
# Expected: No errors

# 3. Linting
npm run lint
# Expected: No errors or warnings

# 4. Formatting check
npm run format:check
# Expected: All files formatted

# 5. Build
npm run build
# Expected: Build succeeds

# 6. Docker build
docker-compose build
# Expected: Build succeeds, no security warnings

# 7. Start services
docker-compose up -d
# Expected: All services start (check with docker-compose ps)

# 8. Development server
npm run dev
# Expected: Server starts on http://localhost:3000
```

### Manual Verification
- [ ] Visit http://localhost:3000 - page loads
- [ ] Open DevTools - no console errors
- [ ] Check Network tab - Tailwind CSS loads
- [ ] Inspect element - verify OKLCH colors applied
- [ ] Test responsive design - mobile viewport works
- [ ] Verify fonts loaded - Playfair Display visible

---

## 📊 Phase 1 Completion Criteria

**Definition of Done:**
1. All files in Task 1.1-1.6 are created and validated
2. `npm install` completes without errors
3. `docker-compose up` starts all services successfully
4. `npm run dev` starts the development server
5. `npm run build` creates a production build
6. `npm run type-check` passes with no errors
7. `npm run lint` passes with no errors
8. Manual verification confirms Tailwind v4 styles are applied

**Next Phase Trigger:**
Once all criteria above are met, proceed to **Phase 2: Database Schema & ORM**

---

## 🔄 Rollback Plan

If issues encountered:
1. Stop Docker: `docker-compose down -v` (removes volumes)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules: `rm -rf node_modules package-lock.json`
4. Restart from Task 1.1

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Author:** Master Architect
