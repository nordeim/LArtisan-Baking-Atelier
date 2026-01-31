# Phase 3: Core Utilities & Authentication — DETAILED SUB-PLAN

## 📋 Executive Overview

**Phase Objective:** Implement core utility functions including JWT authentication, Singapore GST calculations, rate limiting, and input validation schemas. This phase establishes the security and financial integrity foundation for the e-commerce platform.

**Estimated Duration:** 2-3 days  
**Dependencies:** Phase 2 (Database Schema) must be complete  
**Prerequisites:** Docker running (PostgreSQL & Redis), Prisma client generated

**Success Criteria:**
- [ ] All utility functions have unit tests that pass
- [ ] JWT tokens can be created, verified, and revoked
- [ ] GST calculations are accurate to the cent (integer arithmetic)
- [ ] Rate limiting prevents abuse (5 req/15min for checkout)
- [ ] All validation schemas enforce correct data formats
- [ ] TypeScript compilation passes with strict mode

---

## 🗂️ Task Breakdown

### TASK 3.1: GST Calculator (Financial Precision)

**Priority:** CRITICAL  
**Estimated Time:** 2-3 hours  
**Dependencies:** None (pure function)

#### 3.1.1 GST Calculation Engine

**File:** `src/lib/gst-calculator.ts`

**Purpose:** Singapore GST 9% calculation with integer arithmetic to prevent floating-point errors.

**Functions to Implement:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `calculateGST` | `(amountInCents: number, gstRate?: number) => PricingBreakdown` | Calculate GST breakdown |
| `formatPrice` | `(cents: number) => string` | Format cents to SGD currency string |
| `priceToCents` | `(dollars: number) => number` | Convert dollars to cents (integer) |
| `centsToDollars` | `(cents: number) => number` | Convert cents to dollars |
| `calculateLineItemTotal` | `(unitPriceCents: number, quantity: number, gstRate: number) => number` | Calculate total with GST |

**Checklist:**

**Interface Definitions:**
- [ ] Define `PricingBreakdown` interface:
  ```typescript
  interface PricingBreakdown {
    subtotal: number;    // cents
    gstAmount: number;   // cents
    gstRate: number;     // decimal (0.09)
    total: number;       // cents
  }
  ```

**calculateGST Implementation:**
- [ ] Accept `amountInCents` (integer)
- [ ] Accept optional `gstRate` (default 0.09)
- [ ] Calculate GST: `Math.round(amountInCents * gstRate)`
- [ ] Calculate total: `subtotal + gstAmount`
- [ ] Return all values as integers (cents)
- [ ] Handle edge cases: zero, negative numbers

**formatPrice Implementation:**
- [ ] Use `Intl.NumberFormat` with locale 'en-SG'
- [ ] Currency: SGD
- [ ] Format: `$XX.XX`
- [ ] Handle negative values correctly

**Conversion Functions:**
- [ ] `priceToCents`: Multiply by 100, round to integer
- [ ] `centsToDollars`: Divide by 100
- [ ] Handle floating-point precision in conversions

**Validation:**
```typescript
// Test cases to verify
calculateGST(1000) // $10.00 → GST $0.90, Total $10.90
calculateGST(1099) // $10.99 → GST $0.99, Total $11.98
calculateGST(0)    // Edge case: all zeros
```

---

#### 3.1.2 GST Calculator Unit Tests

**File:** `src/lib/__tests__/gst-calculator.test.ts`

**Checklist:**
- [ ] Test standard GST calculation (9%)
- [ ] Test rounding behavior
- [ ] Test zero amounts
- [ ] Test large amounts
- [ ] Test custom GST rates
- [ ] Test price formatting
- [ ] Test cents/dollars conversion
- [ ] Test precision (no floating point errors)

**Test Cases Required:**
```typescript
// Standard calculations
calculateGST(1000) // $10.00 + $0.90 = $10.90
calculateGST(1099) // $10.99 + $0.99 = $11.98
calculateGST(999)  // $9.99 + $0.90 = $10.89

// Rounding
calculateGST(333)  // $3.33 + $0.30 = $3.63 (rounded)

// Zero
calculateGST(0)    // All zeros

// Formatting
formatPrice(1090)  // "$10.90"
formatPrice(100000) // "$1,000.00"
```

---

### TASK 3.2: Authentication Utilities (JWT)

**Priority:** CRITICAL  
**Estimated Time:** 3-4 hours  
**Dependencies:** Database client, environment variables

#### 3.2.1 JWT Authentication Module

**File:** `src/lib/auth.ts`

**Purpose:** JWT token management with Jose library, secure cookie handling.

**Functions to Implement:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `hashPassword` | `(password: string) => Promise<string>` | Bcrypt hash with 12 rounds |
| `verifyPassword` | `(password: string, hashed: string) => Promise<boolean>` | Compare password |
| `createToken` | `(payload: TokenPayload) => Promise<string>` | Sign JWT |
| `verifyToken` | `(token: string) => Promise<JWTPayload \| null>` | Verify JWT |
| `setAuthCookie` | `(token: string) => Promise<void>` | Set secure cookie |
| `removeAuthCookie` | `() => Promise<void>` | Clear cookie |
| `getAuthToken` | `() => Promise<string \| undefined>` | Get token from cookie |
| `getCurrentUser` | `() => Promise<JWTPayload \| null>` | Get current user |
| `requireAuth` | `(req: NextRequest) => Promise<JWTPayload>` | Middleware helper |

**Checklist:**

**Interface Definitions:**
- [ ] Define `JWTPayload` interface:
  ```typescript
  interface JWTPayload {
    sub: string;      // user id
    email: string;
    name?: string;
    role: UserRole;
    iat: number;
    exp: number;
  }
  ```
- [ ] Define `TokenPayload` (omit iat/exp from input)

**Password Hashing:**
- [ ] Use `bcryptjs` (pure JS, no native deps)
- [ ] Salt rounds: 12
- [ ] Async functions with Promise

**JWT Signing (Jose):**
- [ ] Algorithm: HS256
- [ ] Secret from `JWT_SECRET` env var
- [ ] Expiration: 8 hours (8h)
- [ ] Issued at: now
- [ ] Include user ID, email, role

**Cookie Configuration:**
- [ ] Name: `__Host-artisan-token` (prefix for security)
- [ ] httpOnly: true
- [ ] secure: true in production
- [ ] sameSite: 'strict'
- [ ] maxAge: 8 hours (in seconds)
- [ ] path: '/'

**Security Considerations:**
- [ ] Token verification returns null on failure (not throw)
- [ ] Cookie name uses `__Host-` prefix
- [ ] Environment variable validation
- [ ] No sensitive data in JWT payload

---

#### 3.2.2 Authentication Unit Tests

**File:** `src/lib/__tests__/auth.test.ts`

**Checklist:**
- [ ] Test password hashing produces different hashes
- [ ] Test password verification (correct/incorrect)
- [ ] Test token creation
- [ ] Test token verification (valid/invalid/expired)
- [ ] Test token payload structure
- [ ] Mock cookie operations

**Test Cases:**
```typescript
// Password hashing
const hash1 = await hashPassword('password123')
const hash2 = await hashPassword('password123')
// hash1 !== hash2 (different salts)

// Password verification
await verifyPassword('password123', hash1) // true
await verifyPassword('wrong', hash1)       // false

// JWT operations
const token = await createToken({ sub: '123', email: 'test@test.com', role: 'CUSTOMER' })
const payload = await verifyToken(token)
// payload.sub === '123'
```

---

### TASK 3.3: Rate Limiting

**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Dependencies:** Redis running

#### 3.3.1 Rate Limiting Module

**File:** `src/lib/rate-limit.ts`

**Purpose:** Prevent API abuse with sliding window rate limiting.

**Functions to Implement:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `rateLimit` | `(options: RateLimitOptions) => RateLimiter` | Factory function |
| `check` | `(token: string, limit: number) => Promise<void>` | Check rate limit |

**Checklist:**

**Interface Definitions:**
- [ ] Define `RateLimitOptions`:
  ```typescript
  interface RateLimitOptions {
    windowMs: number;      // Time window in milliseconds
    maxRequests: number;   // Max requests per window
  }
  ```

**Implementation Options:**

**Option A: Memory-based (for single instance)**
- [ ] Use `lru-cache` package
- [ ] Store request counts per token
- [ ] Automatic expiration

**Option B: Redis-based (for distributed)**
- [ ] Use Redis for shared state
- [ ] Redis key: `rate_limit:{token}`
- [ ] Redis expire for automatic cleanup

**Pre-configured Rate Limiters:**
- [ ] `authRateLimit` — 100 requests per hour (login attempts)
- [ ] `checkoutRateLimit` — 5 requests per 15 minutes
- [ ] `apiRateLimit` — 1000 requests per hour (general API)

**Error Handling:**
- [ ] Throw `RateLimitError` with 429 status
- [ ] Include `Retry-After` header information

---

#### 3.3.2 Rate Limiting Unit Tests

**File:** `src/lib/__tests__/rate-limit.test.ts`

**Checklist:**
- [ ] Test allows requests under limit
- [ ] Test blocks requests over limit
- [ ] Test window reset
- [ ] Test different tokens don't share limits

---

### TASK 3.4: Validation Schemas (Zod)

**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Dependencies:** None (pure validation)

#### 3.4.1 Input Validation Schemas

**File:** `src/lib/validation.ts`

**Purpose:** Type-safe input validation with Zod.

**Schemas to Implement:**

| Schema | Purpose | Fields |
|--------|---------|--------|
| `loginSchema` | Login form | email, password |
| `registerSchema` | Registration | email, password, name |
| `checkoutSchema` | Checkout | items, shippingAddress, customerInfo |
| `productFilterSchema` | Product filtering | category, price range, etc. |
| `addressSchema` | Singapore address | line1, line2, city, postalCode |

**Checklist:**

**Login Schema:**
- [ ] Email: valid email format
- [ ] Password: minimum 8 characters

**Register Schema:**
- [ ] Email: valid email, unique
- [ ] Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number
- [ ] Name: min 2 characters, optional

**Address Schema (Singapore):**
- [ ] line1: 1-100 chars, required
- [ ] line2: max 100 chars, optional
- [ ] city: 1-50 chars, required (usually "Singapore")
- [ ] postalCode: exactly 6 digits (Singapore format)
- [ ] country: literal 'SG'

**Checkout Schema:**
- [ ] items: array of { productId (cuid), quantity (1-99) }
- [ ] shippingAddress: addressSchema
- [ ] customerEmail: valid email
- [ ] customerName: 1-100 chars
- [ ] customerPhone: optional, 8 digits (Singapore)

**Product Filter Schema:**
- [ ] category: optional string
- [ ] minPrice: optional positive number
- [ ] maxPrice: optional positive number
- [ ] isAvailable: optional boolean
- [ ] isFeatured: optional boolean
- [ ] search: optional string (min 2 chars)
- [ ] page: optional positive integer
- [ ] limit: optional integer (1-100)

**Error Messages:**
- [ ] Custom error messages for all validations
- [ ] User-friendly messages (not just "Invalid input")

---

#### 3.4.2 Validation Unit Tests

**File:** `src/lib/__tests__/validation.test.ts`

**Checklist:**
- [ ] Test valid inputs pass
- [ ] Test invalid inputs fail with correct errors
- [ ] Test edge cases (empty strings, null, undefined)
- [ ] Test password strength requirements
- [ ] Test Singapore postal code format

---

### TASK 3.5: Utility Helpers

**Priority:** MEDIUM  
**Estimated Time:** 1-2 hours  
**Dependencies:** None

#### 3.5.1 Common Utilities

**File:** `src/lib/utils.ts`

**Functions to Implement:**

| Function | Purpose |
|----------|---------|
| `cn(...inputs: ClassValue[])` | Merge Tailwind classes (clsx + tailwind-merge) |
| `formatDate(date: Date)` | Format date for display |
| `formatDateTime(date: Date)` | Format date and time |
| `generateOrderNumber()` | Generate unique order number (ORD-YYYYMMDD-XXXX) |
| `slugify(text: string)` | Convert text to URL-friendly slug |
| `truncate(text: string, length: number)` | Truncate text with ellipsis |

**Checklist:**
- [ ] Implement `cn()` with clsx and tailwind-merge
- [ ] Date formatting with Singapore locale
- [ ] Order number generator with date and random
- [ ] Slugify with lowercase, hyphenation

---

## ✅ Phase 3 Integration Checklist

### Pre-Flight Verification
- [ ] Phase 2 complete (database migrated and seeded)
- [ ] Environment variables set (`JWT_SECRET`)
- [ ] Redis running (for rate limiting)
- [ ] Dependencies installed

### GST Calculator
- [ ] `src/lib/gst-calculator.ts` created
- [ ] All functions implemented
- [ ] Unit tests pass
- [ ] No floating-point errors

### Authentication
- [ ] `src/lib/auth.ts` created
- [ ] JWT operations work
- [ ] Cookie handling secure
- [ ] Unit tests pass
- [ ] Password hashing uses bcrypt

### Rate Limiting
- [ ] `src/lib/rate-limit.ts` created
- [ ] Pre-configured limiters defined
- [ ] LRU-cache or Redis implementation

### Validation
- [ ] `src/lib/validation.ts` created
- [ ] All schemas defined
- [ ] Custom error messages
- [ ] Unit tests pass

### Utilities
- [ ] `src/lib/utils.ts` created
- [ ] Common helpers implemented

### Validation Commands (Run These)
```bash
# 1. Run unit tests
npm run test
# Expected: All tests pass

# 2. Type checking
npm run type-check
# Expected: No errors

# 3. Build
npm run build
# Expected: Build succeeds

# 4. Lint
npm run lint
# Expected: No errors
```

### Manual Verification
- [ ] GST calculations match expected values
- [ ] JWT tokens can be created and verified
- [ ] Rate limiting blocks excessive requests
- [ ] Validation schemas reject invalid input

---

## 📊 Phase 3 Completion Criteria

**Definition of Done:**
1. All utility functions implemented and tested
2. Unit tests pass with >80% coverage
3. JWT authentication flow works
4. GST calculations are accurate
5. Rate limiting prevents abuse
6. Validation schemas enforce correct formats
7. TypeScript strict mode passes
8. No security vulnerabilities in code

**Next Phase Trigger:**
Once all criteria above are met, proceed to **Phase 4: Layout Components**

---

## 🔐 Security Checklist

- [ ] JWT secret is strong (min 32 chars)
- [ ] Cookies use `__Host-` prefix
- [ ] Passwords hashed with bcrypt (12 rounds)
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all user inputs
- [ ] No sensitive data in JWT payload
- [ ] Token expiration set (8 hours)

---

## 📊 Test Coverage Requirements

| Module | Coverage Target |
|--------|-----------------|
| gst-calculator | 100% |
| auth | 90% |
| rate-limit | 80% |
| validation | 90% |
| utils | 70% |

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Author:** Master Architect
