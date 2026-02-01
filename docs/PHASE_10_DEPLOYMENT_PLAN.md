# Phase 10: Production Deployment & DevOps

## Sub-Plan Version: 1.0.0
**Status:** Ready for Review  
**Estimated Duration:** 3-4 days  
**Prerequisites:** Phases 1-9 Complete (44 routes, 84 tests passing)

---

## Executive Summary

This sub-plan consolidates the remaining Testing (Phase 10) and Deployment (Phase 11) work from the MASTER_EXECUTION_PLAN into a cohesive final phase. The goal is production-ready deployment with CI/CD, monitoring, and operational tooling.

**Current State:**
| Component | Status | Notes |
|-----------|--------|-------|
| Unit Tests | ✅ 84 passing | GST calculator, cart utilities |
| Next.js Config | ✅ Production-ready | Standalone output, security headers |
| Docker Setup | ✅ Partial | Multi-stage Dockerfile exists, compose needs production variant |
| CI/CD | ❌ Missing | No GitHub Actions workflows |
| E2E Tests | 🟡 Partial | Playwright configured (test scripts ready), test files empty |
| Monitoring | ❌ Missing | No Sentry integration |
| Email Service | ❌ Missing | No transactional email setup |
| DB Backups | ❌ Missing | No automated backup strategy |
| Security Headers | 🟡 Partial | Basic headers set, CSP needs configuration |

---

## 10.1 E2E Testing with Playwright

**Objective:** Validate critical user journeys end-to-end.

**Estimated Effort:** 1 day

| File | Action | Purpose | Checklist |
|------|--------|---------|-----------|
| `tests/e2e/auth.spec.ts` | Create | Authentication flows | [ ] Register new account<br>[ ] Login with credentials<br>[ ] Access protected /account routes<br>[ ] Logout functionality |
| `tests/e2e/shop.spec.ts` | Create | Shopping experience | [ ] Browse product catalog<br>[ ] Filter by category<br>[ ] View product details<br>[ ] Add to cart from PDP<br>[ ] Cart persistence across reloads |
| `tests/e2e/checkout.spec.ts` | Create | Checkout flow | [ ] Guest checkout flow<br>[ ] Authenticated checkout flow<br>[ ] Stripe payment completion<br>[ ] Order confirmation page |
| `tests/e2e/admin.spec.ts` | Create | Admin dashboard | [ ] Admin login<br>[ ] View orders list<br>[ ] Update order status<br>[ ] View product list<br>[ ] CRUD product operations |

**Test Infrastructure (Already Configured):**
- [x] Playwright installed (`@playwright/test` in devDependencies)
- [x] Test scripts defined (`test:e2e`, `test:e2e:ui`)
- [x] Test directories created (`tests/e2e/`, `tests/a11y/`)
- [ ] Seed test database with known data
- [ ] Create test Stripe account with test cards
- [ ] Set up test admin credentials
- [ ] Configure Playwright auth state storage

---

## 10.2 CI/CD Pipeline (GitHub Actions)

**Objective:** Automated testing, building, and deployment.

**Estimated Effort:** 1 day

### 10.2.1 Continuous Integration

| File | Action | Purpose | Checklist |
|------|--------|---------|-----------|
| `.github/workflows/ci.yml` | Create | PR checks | [ ] Checkout code<br>[ ] Setup Node.js 20<br>[ ] Install dependencies<br>[ ] Run TypeScript type check<br>[ ] Run ESLint<br>[ ] Run unit tests (Vitest)<br>[ ] Build Next.js application<br>[ ] Upload build artifacts |
| `.github/workflows/e2e.yml` | Create | E2E testing | [ ] Run on PRs and main branch<br>[ ] Start PostgreSQL service container<br>[ ] Run migrations<br>[ ] Seed test data<br>[ ] Run Playwright tests<br>[ ] Upload test results and screenshots on failure |

### 10.2.2 Continuous Deployment

| File | Action | Purpose | Checklist |
|------|--------|---------|-----------|
| `.github/workflows/deploy-staging.yml` | Create | Staging deployment | [ ] Trigger on push to `develop` branch<br>[ ] Build Docker image<br>[ ] Push to container registry (GitHub Packages/ECR)<br>[ ] Deploy to staging environment<br>[ ] Run smoke tests<br>[ ] Notify on success/failure |
| `.github/workflows/deploy-production.yml` | Create | Production deployment | [ ] Trigger on push to `main` branch<br>[ ] Require manual approval<br>[ ] Build production Docker image<br>[ ] Push to container registry<br>[ ] Run database migrations<br>[ ] Deploy to production<br>[ ] Run health checks<br>[ ] Rollback capability on failure |

**Environment Protection Rules:**
- [ ] Configure `main` branch protection (require PR, status checks)
- [ ] Require manual approval for production deployments
- [ ] Limit deployment secrets to protected branches

---

## 10.3 Production Infrastructure

**Objective:** Production-ready Docker configuration and orchestration.

**Estimated Effort:** 1 day

### 10.3.1 Docker Production Configuration

**Existing Dockerfile Analysis:**
The current `Dockerfile` has a solid multi-stage build:
- ✅ Stage 1: Dependencies (production only)
- ✅ Stage 2: Builder (dev deps + build)
- ✅ Stage 3: Runner (production, non-root user)
- ✅ Stage 4: Development target
- ✅ Health check configured
- ✅ Standalone output compatible

| File | Action | Purpose | Checklist |
|------|--------|---------|-----------|
| `docker-compose.prod.yml` | Create | Production orchestration | [ ] Next.js app service (replicas: 2+)<br>[ ] PostgreSQL with persistent volume<br>[ ] Redis for session/cache<br>[ ] Nginx reverse proxy<br>[ ] SSL/TLS termination<br>[ ] Environment variable injection from secrets<br>[ ] Health checks for all services<br>[ ] Resource limits (CPU/memory) |
| `docker-compose.override.yml` | Create | Local development overrides | [ ] Mount source for hot reload<br>[ ] Expose PostgreSQL port for debugging<br>[ ] Development environment variables |
| `.dockerignore` | Update | Optimize build context | [ ] Exclude .git, node_modules, .env<br>[ ] Exclude test files<br>[ ] Exclude docs and markdown |

**Docker Services Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│                      Nginx (LB/SSL)                      │
│         - SSL termination                               │
│         - Rate limiting                                 │
│         - Static asset caching                          │
└──────────────────┬──────────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼──────┐         ┌──────▼──────┐
│   Next.js   │         │   Next.js   │
│   App (1)   │         │   App (2)   │
└──────┬──────┘         └──────┬──────┘
       │                       │
       └───────────┬───────────┘
                   │
       ┌───────────▼───────────┐
       │     PostgreSQL        │
       │  (Primary + Replica)  │
       └───────────┬───────────┘
                   │
       ┌───────────▼───────────┐
       │        Redis          │
       │  (Session/Cache)      │
       └───────────────────────┘
```

### 10.3.2 Environment Configuration

| File | Action | Purpose | Checklist |
|------|--------|---------|-----------|
| `.env.production.example` | Create | Production env template | [ ] Database URL format<br>[ ] JWT secret requirements<br>[ ] Stripe live keys<br>[ ] Sentry DSN<br>[ ] Email service credentials<br>[ ] Redis URL |
| `.env.staging.example` | Create | Staging env template | [ ] Staging database<br>[ ] Test Stripe keys<br>[ ] Sentry DSN (staging project) |

**Required Production Secrets:**
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Authentication
JWT_SECRET="min-32-char-random-string"

# Stripe (LIVE keys for production)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Monitoring
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="..."

# Email (Resend recommended)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@artisan-baking.com"

# Redis
REDIS_URL="redis://host:6379"

# App
NEXT_PUBLIC_APP_URL="https://artisan-baking.com"
NODE_ENV="production"
```

---

## 10.4 Monitoring & Error Tracking

**Objective:** Production observability and alerting.

**Estimated Effort:** 0.5 days

| File | Action | Purpose | Checklist |
|------|--------|---------|-----------|
| `src/lib/sentry.ts` | Create | Sentry configuration | [ ] Initialize with DSN<br>[ ] Configure environment (production/staging)<br>[ ] Set release version from git hash<br>[ ] Configure sampling rates |
| `src/app/global-error.tsx` | Create | Error boundary | [ ] Capture React errors with Sentry<br>[ ] Display user-friendly error UI<br>[ ] Provide refresh/home links |
| `instrumentation.ts` | Create | OpenTelemetry/instrumentation | [ ] Register Sentry on server start<br>[ ] Configure performance monitoring |
| `sentry.client.config.ts` | Create | Client-side Sentry | [ ] Initialize browser SDK<br>[ ] Configure breadcrumbs<br>[ ] User context enrichment |
| `sentry.server.config.ts` | Create | Server-side Sentry | [ ] Initialize Node SDK<br>[ ] Configure tracing |
| `sentry.edge.config.ts` | Create | Edge runtime Sentry | [ ] Initialize for middleware/edge |

**Sentry Integration Points:**
- [ ] API route error capturing
- [ ] Checkout flow error tracking
- [ ] Payment failure analytics
- [ ] Performance monitoring (Core Web Vitals)
- [ ] User feedback widget on error pages

---

## 10.5 Email Service Integration

**Objective:** Transactional email for orders, auth, and notifications.

**Estimated Effort:** 0.5 days

| File | Action | Purpose | Checklist |
|------|--------|---------|-----------|
| `src/lib/email.ts` | Create | Email service abstraction | [ ] Resend SDK initialization<br>[ ] Send email helper function<br>[ ] Error handling and retries<br>[ ] Template rendering setup |
| `src/lib/email/templates/order-confirmation.tsx` | Create | Order email template | [ ] Responsive React Email template<br>[ ] Order details table<br>[ ] Digital course access links<br>[ ] GST breakdown |
| `src/lib/email/templates/password-reset.tsx` | Create | Password reset email | [ ] Reset link with token<br>[ ] Expiration notice<br>[ ] Security notice |
| `src/lib/email/templates/welcome.tsx` | Create | Welcome email | [ ] Onboarding content<br>[ ] Course recommendations<br>[ ] Support contact |

**Email Triggers:**
- [ ] Order confirmation (on payment success)
- [ ] Password reset request
- [ ] Welcome email (on registration)
- [ ] Course access granted notification
- [ ] Order status updates (shipped/delivered)

**Implementation Note:** Update Stripe webhook handler to send confirmation emails after successful payment.

---

## 10.6 Database Backup Strategy

**Objective:** Automated, tested database backups.

**Estimated Effort:** 0.5 days

| File | Action | Purpose | Checklist |
|------|--------|---------|-----------|
| `scripts/backup-db.sh` | Create | Backup script | [ ] pg_dump with compression<br>[ ] Timestamp in filename<br>[ ] Upload to S3/cloud storage<br>[ ] Retention policy (keep last 30 days)<br>[ ] Error notifications |
| `scripts/restore-db.sh` | Create | Restore script | [ ] Download from backup storage<br>[ ] Verify backup integrity<br>[ ] Restore to target database<br>[ ] Verification queries |
| `.github/workflows/backup.yml` | Create | Automated backups | [ ] Daily scheduled run<br>[ ] Manual dispatch option<br>[ ] Backup verification step<br>

**Backup Schedule:**
- [ ] Automated daily backups at 2 AM UTC
- [ ] Weekly full backup retention (4 weeks)
- [ ] Monthly backup retention (12 months)
- [ ] Point-in-time recovery capability (if supported by host)

---

## 10.7 Security Hardening

**Objective:** Production security validation.

**Estimated Effort:** 0.5 days

| Check | Status | Action |
|-------|--------|--------|
| [ ] HTTPS only | Required | Enforce SSL redirect, HSTS header |
| [ ] Security headers | Required | CSP, X-Frame-Options, X-Content-Type-Options |
| [ ] CORS policy | Required | Strict origin whitelist |
| [ ] Rate limiting | Required | Implement on auth and checkout endpoints |
| [ ] Input sanitization | Required | Validate all API inputs with Zod |
| [ ] SQL injection prevention | Complete | Prisma ORM parameterized queries |
| [ ] XSS prevention | Required | React auto-escaping + CSP |
| [ ] CSRF protection | Required | SameSite cookies + tokens if needed |
| [ ] Secrets management | Required | Use environment variables, never commit |
| [ ] Dependency scanning | Required | npm audit in CI pipeline |

**Security Headers to Add:**
```typescript
// In next.config.ts headers()
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://images.unsplash.com data:; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com;"
},
{
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains; preload'
}
```

---

## 10.8 Performance Optimization

**Objective:** Lighthouse score >90 across all categories.

**Estimated Effort:** 0.5 days

| Optimization | Status | Action |
|--------------|--------|--------|
| [ ] Image optimization | Partial | Next.js Image component, WebP/AVIF |
| [ ] Font optimization | Complete | Next.js font optimization |
| [ ] Code splitting | Complete | Next.js automatic splitting |
| [ ] Tree shaking | Complete | Dead code elimination |
| [ ] Compression | Complete | Brotli/Gzip enabled |
| [ ] CDN | Required | Vercel Edge Network or CloudFront |
| [ ] Caching | Required | Cache headers for static assets |
| [ ] Bundle analysis | Required | Add @next/bundle-analyzer |

**Lighthouse Targets:**
| Category | Target | Current (est.) |
|----------|--------|----------------|
| Performance | >90 | TBD |
| Accessibility | >95 | TBD |
| Best Practices | >95 | TBD |
| SEO | >95 | TBD |

---

## 10.9 Deployment Verification Checklist

**Pre-Deployment:**
- [ ] All environment variables configured in hosting platform
- [ ] Database migrations tested on staging
- [ ] Stripe webhook endpoints configured for production
- [ ] Sentry project created and DSN configured
- [ ] Email service domain verified (SPF, DKIM, DMARC)
- [ ] SSL certificate configured
- [ ] Domain DNS records pointing to hosting

**Post-Deployment:**
- [ ] Health check endpoint returns 200
- [ ] Homepage loads correctly
- [ ] Product catalog loads
- [ ] Cart functionality works
- [ ] Checkout flow completes (test mode)
- [ ] Admin login works
- [ ] Database connections stable
- [ ] Error tracking receiving events (Sentry)
- [ ] Email delivery working
- [ ] Backup system operational

---

## Integrated Task Tracker

### Week 1: Testing & CI/CD
| Day | Tasks | Deliverables | Validation |
|-----|-------|--------------|------------|
| 1 | E2E test setup, auth tests | `tests/e2e/auth.spec.ts` | Tests pass locally |
| 1 | Shop flow E2E tests | `tests/e2e/shop.spec.ts` | Tests pass locally |
| 2 | Checkout & admin E2E tests | `tests/e2e/*.spec.ts` | All E2E tests pass |
| 2 | CI workflow | `.github/workflows/ci.yml` | CI passes on PR |
| 3 | E2E workflow, staging deploy | `.github/workflows/e2e.yml`, `deploy-staging.yml` | Staging auto-deploys |
| 3 | Production deploy workflow | `.github/workflows/deploy-production.yml` | Manual deploy works |

### Week 2: Infrastructure & Monitoring
| Day | Tasks | Deliverables | Validation |
|-----|-------|--------------|------------|
| 4 | Docker production compose | `docker-compose.prod.yml` | `docker-compose -f docker-compose.prod.yml up` works |
| 4 | Environment templates | `.env.*.example` files | Documented, no secrets |
| 5 | Sentry integration | `sentry.*.config.ts` | Errors appear in Sentry |
| 5 | Error boundaries | `global-error.tsx` | Error UI displays correctly |
| 6 | Email service setup | `src/lib/email.ts`, templates | Test emails send successfully |
| 6 | Backup scripts | `scripts/backup-db.sh` | Backup creates file |
| 7 | Security hardening, perf | Security headers, CSP | Security scan passes |
| 7 | Final validation | All checklist items | Production ready |

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| E2E tests flaky | Medium | Medium | Retry logic, stable selectors, test data isolation |
| Database migration fails in production | High | Low | Test migrations on staging, backup before deploy |
| Stripe webhook misconfiguration | High | Low | Verify webhook endpoints, test in staging |
| Email deliverability issues | Medium | Medium | Use established provider (Resend), configure SPF/DKIM |
| Sentry quota exceeded | Low | Medium | Configure sampling, monitor usage |
| Docker build failures | Medium | Low | Multi-stage build, cache layers, test locally |

---

## Success Criteria

### Must Have (MVP)
- [ ] CI pipeline running on all PRs
- [ ] Staging environment auto-deploys from `develop`
- [ ] Production deployment workflow functional
- [ ] Sentry error tracking operational
- [ ] Email service sending transactional emails
- [ ] Automated daily database backups

### Should Have
- [ ] E2E tests covering critical paths
- [ ] Lighthouse score >90 all categories
- [ ] Security headers configured (CSP)
- [ ] Performance monitoring (Core Web Vitals)

### Nice to Have
- [ ] Automated rollback on deployment failure
- [ ] Database point-in-time recovery
- [ ] Load testing completed
- [ ] Documentation site deployed

---

## Post-Phase 10: Operational Runbook

### Deployment Process
1. Create PR from `develop` to `main`
2. CI pipeline runs (type check, lint, tests, build)
3. Review and merge PR
4. Manual approval for production deploy
5. GitHub Actions deploys to production
6. Run smoke tests
7. Monitor Sentry for errors

### Incident Response
1. Check Sentry for error spikes
2. Review recent deployments
3. Rollback if needed: `git revert` + redeploy
4. Communicate status to stakeholders
5. Post-incident review

### Routine Maintenance
- Daily: Monitor Sentry, review backup logs
- Weekly: Review Lighthouse scores, dependency updates
- Monthly: Security audit, access review

---

## Review & Validation

### Self-Review Checklist
- [ ] All tasks have clear acceptance criteria
- [ ] Effort estimates are realistic (3-4 days total)
- [ ] Dependencies between tasks identified
- [ ] Risk mitigation strategies defined
- [ ] Success criteria measurable

### External Review Questions
1. Are the E2E test priorities correct (auth > shop > checkout > admin)?
2. Is Docker Swarm/Kubernetes needed, or is Docker Compose sufficient?
3. Should we add load testing before production?
4. Are there compliance requirements beyond PDPA (PCI-DSS for Stripe)?

---

**Document Status:** Ready for Execution  
**Last Updated:** 2026-01-31  
**Next Review:** Before Phase 10 kickoff
