# Phase 2: Database Schema & ORM — DETAILED SUB-PLAN

## 📋 Executive Overview

**Phase Objective:** Design and implement the complete database schema with Prisma ORM, including PDPA compliance features, Singapore GST-compliant DECIMAL precision, and seed data for development.

**Estimated Duration:** 2-3 days  
**Dependencies:** Phase 1 (Foundation) must be complete  
**Prerequisites:** Docker running (PostgreSQL available), Node.js 20+

**Success Criteria:**
- [ ] Prisma schema validates without errors (`prisma validate`)
- [ ] Database migrations apply successfully (`prisma migrate dev`)
- [ ] Seed script populates database with test data
- [ ] Prisma client singleton works correctly
- [ ] TypeScript types generated and usable

---

## 🗂️ Task Breakdown

### TASK 2.1: Prisma Schema Design

**Priority:** CRITICAL  
**Estimated Time:** 4-6 hours  
**Dependencies:** Phase 1 complete

#### 2.1.1 Schema Configuration Block

**File:** `prisma/schema.prisma`

**Checklist:**
- [ ] Set `generator client` with `prisma-client-js` provider
- [ ] Enable `postgresqlExtensions` preview feature
- [ ] Enable `driverAdapters` preview feature (for `@prisma/adapter-pg`)
- [ ] Configure `datasource db` with PostgreSQL provider
- [ ] Add `pgcrypto` extension
- [ ] Configure connection URL from environment variable

**Configuration Requirements:**
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions", "driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [pgcrypto]
}
```

---

#### 2.1.2 Enums Definition

**Checklist:**

**UserRole Enum:**
- [ ] `CUSTOMER` — Standard user
- [ ] `ADMIN` — Full administrative access
- [ ] `BAKER` — Content creator/instructor role

**OrderStatus Enum:**
- [ ] `PENDING` — Order created, awaiting payment
- [ ] `CONFIRMED` — Payment received, order confirmed
- [ ] `PREPARING` — Order being prepared
- [ ] `READY` — Order ready for pickup/delivery
- [ ] `SHIPPED` — Order shipped
- [ ] `DELIVERED` — Order delivered
- [ ] `CANCELLED` — Order cancelled

**PaymentStatus Enum:**
- [ ] `PENDING` — Awaiting payment
- [ ] `PAID` — Payment successful
- [ ] `FAILED` — Payment failed
- [ ] `REFUNDED` — Payment refunded

---

#### 2.1.3 User Model

**Checklist:**
- [ ] `id` — String, CUID, primary key
- [ ] `email` — String, unique, required
- [ ] `name` — String, optional
- [ ] `hashedPassword` — String, required (map to `hashed_password`)
- [ ] `role` — UserRole enum, default CUSTOMER
- [ ] `emailVerified` — DateTime, optional (map to `email_verified`)
- [ ] `createdAt` — DateTime, default now (map to `created_at`)
- [ ] `updatedAt` — DateTime, auto-update (map to `updated_at`)
- [ ] **PDPA Fields:**
  - `deletionRequested` — DateTime, optional (map to `deletion_requested`)
  - `dataExportRequested` — DateTime, optional (map to `data_export_requested`)
- [ ] **Relations:**
  - `accounts` — Account[] (OAuth accounts)
  - `sessions` — Session[] (active sessions)
  - `orders` — Order[] (user's orders)
  - `reviews` — Review[] (user's reviews)
- [ ] Map model name to `users`
- [ ] Add @@index for email lookups

**Validation:**
- [ ] Email field has @unique constraint
- [ ] Password never stored in plaintext
- [ ] PDPA fields documented

---

#### 2.1.4 Account Model (OAuth)

**Checklist:**
- [ ] `id` — String, CUID, primary key
- [ ] `userId` — String, required (map to `user_id`)
- [ ] `type` — String, required (oauth provider type)
- [ ] `provider` — String, required
- [ ] `providerAccountId` — String, required (map to `provider_account_id`)
- [ ] `refresh_token` — String?, Text type (encrypted)
- [ ] `access_token` — String?, Text type (encrypted)
- [ ] `expires_at` — Int?, optional
- [ ] `token_type` — String?, optional
- [ ] `scope` — String?, optional
- [ ] `id_token` — String?, Text type (encrypted)
- [ ] `session_state` — String?, optional
- [ ] **Relations:**
  - `user` — User relation, required, cascade delete
- [ ] Unique constraint: `@@unique([provider, providerAccountId])`
- [ ] Map model name to `accounts`
- [ ] Add @@index for user lookups

---

#### 2.1.5 Session Model

**Checklist:**
- [ ] `id` — String, CUID, primary key
- [ ] `sessionToken` — String, unique (map to `session_token`)
- [ ] `userId` — String, required (map to `user_id`)
- [ ] `expires` — DateTime, required
- [ ] **Relations:**
  - `user` — User relation, required, cascade delete
- [ ] Map model name to `sessions`
- [ ] Add @@index for token lookups
- [ ] Add @@index for user lookups

---

#### 2.1.6 Category Model

**Checklist:**
- [ ] `id` — String, CUID, primary key
- [ ] `name` — String, unique, required
- [ ] `slug` — String, unique, required
- [ ] `description` — String?, optional
- [ ] `image` — String?, optional (category image URL)
- [ ] `sortOrder` — Int, default 0 (map to `sort_order`)
- [ ] `isActive` — Boolean, default true (map to `is_active`)
- [ ] `createdAt` — DateTime, default now (map to `created_at`)
- [ ] `updatedAt` — DateTime, auto-update (map to `updated_at`)
- [ ] **Relations:**
  - `products` — Product[]
- [ ] Map model name to `categories`
- [ ] Add @@index for slug lookups

---

#### 2.1.7 Product Model

**Checklist:**
- [ ] `id` — String, CUID, primary key
- [ ] `name` — String, required
- [ ] `slug` — String, unique, required
- [ ] `description` — String, required, Text type
- [ ] `shortDescription` — String?, optional (map to `short_description`)
- [ ] `price` — Decimal, required, precision 10, scale 4 (for GST compliance)
- [ ] `compareAtPrice` — Decimal?, optional, precision 10, scale 4 (map to `compare_at_price`)
- [ ] `gstRate` — Decimal, default 0.09, precision 4, scale 4 (map to `gst_rate`)
- [ ] `sku` — String, unique, required
- [ ] `stockQuantity` — Int, default 0 (map to `stock_quantity`)
- [ ] `lowStockThreshold` — Int, default 5 (map to `low_stock_threshold`)
- [ ] `images` — String[], array of image URLs
- [ ] `isAvailable` — Boolean, default true (map to `is_available`)
- [ ] `isFeatured` — Boolean, default false (map to `is_featured`)
- [ ] `isDigital` — Boolean, default false (map to `is_digital`)
- [ ] `weight` — Decimal?, optional, precision 8, scale 3 (in kg)
- [ ] `metaTitle` — String?, optional (map to `meta_title`)
- [ ] `metaDescription` — String?, optional (map to `meta_description`)
- [ ] `categoryId` — String?, optional (map to `category_id`)
- [ ] `createdAt` — DateTime, default now (map to `created_at`)
- [ ] `updatedAt` — DateTime, auto-update (map to `updated_at`)
- [ ] **Relations:**
  - `category` — Category?, optional relation
  - `orderItems` — OrderItem[]
  - `reviews` — Review[]
- [ ] Map model name to `products`
- [ ] Add @@index for slug lookups
- [ ] Add @@index for category lookups
- [ ] Add @@index for featured products
- [ ] Add @@index for availability

**Financial Precision Requirements:**
- [ ] Price uses `Decimal @db.Decimal(10, 4)`
- [ ] GST rate uses `Decimal @db.Decimal(4, 4)`
- [ ] Comments explain Singapore GST 9%

---

#### 2.1.8 Order Model

**Checklist:**
- [ ] `id` — String, CUID, primary key
- [ ] `orderNumber` — String, unique, required (map to `order_number`)
  - Format: ORD-20260131-XXXX (date + sequence)
- [ ] `userId` — String?, optional (map to `user_id`) for guest checkout
- [ ] `status` — OrderStatus, default PENDING
- [ ] `paymentStatus` — PaymentStatus, default PENDING (map to `payment_status`)
- [ ] `paymentMethod` — String?, optional (map to `payment_method`)
- [ ] **Financial Fields (all Decimal 10,4):**
  - `subtotal` — Decimal, required (before GST)
  - `gstAmount` — Decimal, required (map to `gst_amount`)
  - `shippingCost` — Decimal, default 0 (map to `shipping_cost`)
  - `discountAmount` — Decimal, default 0 (map to `discount_amount`)
  - `total` — Decimal, required (final amount)
- [ ] **Customer Details:**
  - `customerEmail` — String, required (map to `customer_email`)
  - `customerName` — String, required (map to `customer_name`)
  - `customerPhone` — String?, optional (map to `customer_phone`)
- [ ] **Addresses (JSON for flexibility):**
  - `shippingAddress` — Json, required (map to `shipping_address`)
  - `billingAddress` — Json?, optional (map to `billing_address`)
- [ ] **Stripe Integration:**
  - `stripePaymentIntentId` — String?, optional (map to `stripe_payment_intent_id`)
  - `stripeCustomerId` — String?, optional (map to `stripe_customer_id`)
- [ ] `notes` — String?, optional, Text type (customer notes)
- [ ] `internalNotes` — String?, optional, Text type (admin notes, map to `internal_notes`)
- [ ] `trackingNumber` — String?, optional (map to `tracking_number`)
- [ ] `shippedAt` — DateTime?, optional (map to `shipped_at`)
  - `deliveredAt` — DateTime?, optional (map to `delivered_at`)
- [ ] `createdAt` — DateTime, default now (map to `created_at`)
- [ ] `updatedAt` — DateTime, auto-update (map to `updated_at`)
- [ ] **Relations:**
  - `user` — User?, optional relation
  - `orderItems` — OrderItem[]
- [ ] Map model name to `orders`
- [ ] Add @@index for orderNumber lookups
- [ ] Add @@index for user lookups
- [ ] Add @@index for status
- [ ] Add @@index for paymentStatus
- [ ] Add @@index for createdAt (sorting)

**Financial Integrity Requirements:**
- [ ] All monetary fields use `Decimal @db.Decimal(10, 4)`
- [ ] GST amount calculated and stored separately
- [ ] Subtotal + GST + Shipping - Discount = Total

---

#### 2.1.9 OrderItem Model

**Checklist:**
- [ ] `id` — String, CUID, primary key
- [ ] `orderId` — String, required (map to `order_id`)
- [ ] `productId` — String, required (map to `product_id`)
- [ ] `quantity` — Int, required, positive
- [ ] `unitPrice` — Decimal, required, precision 10, scale 4 (map to `unit_price`)
  - Price at time of order (snapshot)
- [ ] `gstRate` — Decimal, required, precision 4, scale 4 (map to `gst_rate`)
  - GST rate at time of order
- [ ] `total` — Decimal, required, precision 10, scale 4
  - quantity * unitPrice * (1 + gstRate)
- [ ] `productName` — String, required (map to `product_name`)
  - Snapshot of product name
- [ ] `productSku` — String, required (map to `product_sku`)
  - Snapshot of SKU
- [ ] `productImage` — String?, optional (map to `product_image`)
  - Snapshot of primary image
- [ ] `createdAt` — DateTime, default now (map to `created_at`)
- [ ] **Relations:**
  - `order` — Order, required, cascade delete
  - `product` — Product, required
- [ ] Map model name to `order_items`
- [ ] Add @@index for order lookups
- [ ] Add @@index for product lookups

**Data Integrity:**
- [ ] Order item stores snapshot of product data
- [ ] Historical pricing preserved even if product price changes

---

#### 2.1.10 Review Model

**Checklist:**
- [ ] `id` — String, CUID, primary key
- [ ] `productId` — String, required (map to `product_id`)
- [ ] `userId` — String, required (map to `user_id`)
- [ ] `orderId` — String?, optional (map to `order_id`) — verified purchase
- [ ] `rating` — Int, required (1-5 scale)
- [ ] `title` — String?, optional (review title)
- [ ] `comment` — String?, optional, Text type (review text)
- [ ] `isVerified` — Boolean, default false (map to `is_verified`)
- [ ] `isPublished` — Boolean, default true (map to `is_published`)
- [ ] `helpfulCount` — Int, default 0 (map to `helpful_count`)
- [ ] `createdAt` — DateTime, default now (map to `created_at`)
- [ ] `updatedAt` — DateTime, auto-update (map to `updated_at`)
- [ ] **Relations:**
  - `product` — Product, required
  - `user` — User, required
  - `order` — Order?, optional
- [ ] Unique constraint: `@@unique([productId, userId])` (one review per user per product)
- [ ] Map model name to `reviews`
- [ ] Add @@index for product lookups
- [ ] Add @@index for user lookups

---

### TASK 2.2: Prisma Client Singleton

**Priority:** CRITICAL  
**Estimated Time:** 1-2 hours  
**Dependencies:** Task 2.1

#### 2.2.1 Database Client Implementation

**File:** `src/lib/prisma.ts`

**Checklist:**
- [ ] Import `PrismaClient` from `@prisma/client`
- [ ] Declare global type extension for `prisma` global
- [ ] Implement singleton pattern:
  - Check `globalThis.prisma` in development
  - Create new `PrismaClient` instance if not exists
  - Configure logging based on environment
- [ ] Add connection error handling
- [ ] Export `prisma` instance

**Configuration Requirements:**
```typescript
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};
```

**Validation:**
- [ ] TypeScript compiles without errors
- [ ] Hot reload works in development (global pattern prevents multiple instances)

---

### TASK 2.3: Database Migrations

**Priority:** CRITICAL  
**Estimated Time:** 1-2 hours  
**Dependencies:** Task 2.1, Docker PostgreSQL running

#### 2.3.1 Initial Migration

**Checklist:**
- [ ] Ensure PostgreSQL container is running
- [ ] Run `prisma migrate dev --name init`
- [ ] Verify migration SQL is generated correctly
- [ ] Confirm all DECIMAL fields have correct precision in SQL
- [ ] Confirm all indexes are created
- [ ] Confirm enums are created as PostgreSQL types
- [ ] Run `prisma generate` to generate TypeScript types

**Validation:**
- [ ] Check `prisma/migrations/` folder exists with migration files
- [ ] Review migration SQL for correctness
- [ ] Verify no errors in migration output

---

### TASK 2.4: Seed Data

**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Dependencies:** Task 2.3

#### 2.4.1 Seed Script Implementation

**File:** `prisma/seed.ts`

**Checklist:**

**Setup:**
- [ ] Import `PrismaClient` from `@prisma/client`
- [ ] Import `UserRole` enum
- [ ] Import `bcryptjs` for password hashing
- [ ] Create prisma instance
- [ ] Define main `seed()` function
- [ ] Add error handling with try/catch/finally

**Admin User Creation:**
- [ ] Create admin user with email: `admin@artisan.com`
- [ ] Hash password: `Admin@123456` (12 rounds)
- [ ] Name: `Master Baker`
- [ ] Role: `ADMIN`
- [ ] Use `upsert` to prevent duplicates

**Categories Creation:**
- [ ] Sourdough — slug: `sourdough`
- [ ] Pâtisserie — slug: `patisserie`
- [ ] Viennoiserie — slug: `viennoiserie`
- [ ] Use `upsert` for idempotency

**Products Creation (minimum 5):**
- [ ] Country Sourdough — SD-001, $12.00, featured, category: Sourdough
- [ ] Assorted Macarons (6pcs) — PT-001, $28.00, featured, category: Pâtisserie
- [ ] Butter Croissant — VN-001, $4.50, category: Viennoiserie
- [ ] Pain au Chocolat — VN-002, $5.50, featured, category: Viennoiserie
- [ ] Chocolate Ganache Tart — PT-002, $35.00, category: Pâtisserie

**Product Data Requirements:**
- [ ] Realistic descriptions
- [ ] Stock quantities
- [ ] SKU format: XX-000
- [ ] Unsplash image URLs
- [ ] GST rate: 0.09 (9%)

**Execution:**
- [ ] Run `prisma db seed`
- [ ] Verify data in database (use `prisma studio`)
- [ ] Confirm all relationships work

---

### TASK 2.5: Database Types

**Priority:** MEDIUM  
**Estimated Time:** 1 hour  
**Dependencies:** Task 2.3

#### 2.5.1 Type Exports

**File:** `src/types/database.ts`

**Checklist:**
- [ ] Re-export generated Prisma types:
  - User, Account, Session
  - Product, Category
  - Order, OrderItem
  - Review
- [ ] Re-export enums:
  - UserRole
  - OrderStatus
  - PaymentStatus
- [ ] Create utility types:
  - `ProductWithCategory` — Product + category relation
  - `OrderWithItems` — Order + orderItems + product relations
  - `UserWithOrders` — User + orders relation

**Validation:**
- [ ] Types can be imported in components
- [ ] TypeScript compilation passes

---

## ✅ Phase 2 Integration Checklist

### Pre-Flight Verification
- [ ] Docker is running (`docker ps` shows containers)
- [ ] PostgreSQL container is healthy
- [ ] Node modules installed (`npm install` completed)

### Schema Configuration
- [ ] `prisma/schema.prisma` created with all models
- [ ] All enums defined (UserRole, OrderStatus, PaymentStatus)
- [ ] All models have proper relations
- [ ] All monetary fields use `Decimal @db.Decimal(10, 4)`
- [ ] All PDPA fields included (deletionRequested, dataExportRequested)
- [ ] All createdAt/updatedAt fields configured
- [ ] All @@map directives for snake_case table names
- [ ] All @@index directives for performance

### Client & Migrations
- [ ] `src/lib/prisma.ts` singleton created
- [ ] Migration files generated (`prisma migrate dev --name init`)
- [ ] TypeScript types generated (`prisma generate`)

### Seed Data
- [ ] `prisma/seed.ts` created
- [ ] Admin user created
- [ ] 3+ categories created
- [ ] 5+ products created
- [ ] Seed script runs successfully (`prisma db seed`)

### Type Definitions
- [ ] `src/types/database.ts` created
- [ ] All Prisma types re-exported
- [ ] Utility types created for common relations

### Validation Commands (Run These)
```bash
# 1. Validate Prisma schema
npx prisma validate
# Expected: "The schema at prisma/schema.prisma is valid 🚀"

# 2. Generate Prisma client
npx prisma generate
# Expected: Client generated successfully

# 3. Run migrations (if not already done)
npx prisma migrate dev --name init
# Expected: Migration applied successfully

# 4. Seed database
npx prisma db seed
# Expected: "Created admin user: admin@artisan.com" etc.

# 5. Open Prisma Studio
npx prisma studio
# Expected: Studio opens at http://localhost:5555
# Verify: All tables have data

# 6. TypeScript compilation
npm run type-check
# Expected: No errors

# 7. Build verification
npm run build
# Expected: Build succeeds
```

### Manual Verification
- [ ] Open Prisma Studio (npx prisma studio)
- [ ] Verify all tables exist:
  - users
  - accounts
  - sessions
  - categories
  - products
  - orders
  - order_items
  - reviews
- [ ] Verify data in each table:
  - Admin user exists
  - Categories exist (Sourdough, Pâtisserie, Viennoiserie)
  - Products exist with correct prices
- [ ] Verify relationships:
  - Product → Category relation works
  - User → Orders relation works
  - Order → OrderItems relation works

---

## 📊 Phase 2 Completion Criteria

**Definition of Done:**
1. Prisma schema validates without errors
2. Database migrations apply successfully
3. Prisma client singleton works in application code
4. Seed script populates database with realistic test data
5. TypeScript types are generated and usable
6. Prisma Studio shows all data correctly
7. All financial fields use DECIMAL(10,4)
8. PDPA compliance fields are present

**Next Phase Trigger:**
Once all criteria above are met, proceed to **Phase 3: Core Utilities & Authentication**

---

## 🔄 Rollback Plan

If issues encountered:
1. Reset database: `npx prisma migrate reset`
2. Delete migration files: `rm -rf prisma/migrations/*`
3. Restart from Task 2.1

---

## 🔐 Security & Compliance Notes

### PDPA Compliance (Singapore)
- `deletionRequested` — User requested data deletion
- `dataExportRequested` — User requested data export
- Both fields are timestamps to track when request was made
- Admin dashboard should process these requests

### Financial Precision
- All prices stored in SGD
- DECIMAL(10,4) provides:
  - 6 digits before decimal (up to $999,999.99)
  - 4 digits after decimal (for precise GST calculation)
- GST rate stored as DECIMAL(4,4) = 0.0900 (9%)

### Data Integrity
- Order items store snapshots (product name, price, SKU at time of order)
- Historical data preserved even if product changes
- Soft deletes not used (explicit deletion tracking via PDPA fields)

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Author:** Master Architect
