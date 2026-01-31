# L'Artisan Baking Atelier — Comprehensive Design Specifications

**Source URL:** [http://artisan-baking.jesspete.shop](http://artisan-baking.jesspete.shop)  
**Created:** 2026-01-31  
**Prepared for:** Product / Design / Engineering teams  

---

## 1. Executive Summary

L'Artisan Baking Atelier is an online culinary academy and shop focused on artisan bread, pâtisserie and viennoiserie. The site blends marketing (hero + trust badges + lead magnet) with product/course commerce (course catalog, shop, enrollment, resources). This design specification documents the product goals, user flows, UI system, component library, content requirements, accessibility and performance targets, and implementation notes required to deliver a polished, scalable, and accessible web experience.

**Primary objectives**

* Convert visitors into course enrollments and guide downloads.
* Showcase instructor expertise and social proof (testimonials, partners).
* Support commerce: course purchases, shop items (merch/food), and free lead magnets.
* Provide clear learning paths and lifetime access UX for students.

**Primary KPIs**

* Course enrollments / month
* Lead magnet downloads (email signups)
* Conversion rate from course view → enroll
* Average order value (shop + course bundles)
* Page load time (LCP < 2.5s), Accessibility score (WCAG AA)

---

## 2. Scope & Deliverables

**In scope**

* Full responsive redesign/spec of public site (Home, Courses listing & detail, Shop, Product detail, Cart/Checkout, Account, Journal/Blog, Instructors, Resources (Free Guide), FAQ, Contact, Legal pages).
* Design system (tokens, components, patterns) and annotated React/Tailwind-ready specs.
* Accessibility and internationalization notes (English primary, prepare for i18n).
* Interaction and microcopy guidance.
* Analytics & SEO tracking plan.

**Out of scope (for this deliverable)**

* LMS backend implementation (video hosting, course progress storage). Recommend integration options but not build.
* Payment gateway configuration and PCI scope beyond recommended flow.

---

## 3. Target Users & Personas

1. **Aspiring Home Baker (Amy)**

   * Age 25–45, loves baking as hobby, wants step-by-step video courses.
   * Top goals: learn technique, access recipes, community connection.
2. **Professional Chef/Café Owner (Marco)**

   * Age 30–50, seeks advanced techniques and credentials.
   * Top goals: speed-of-learning, industry-recognized certificate.
3. **Gift Buyer / Shopper (Lily)**

   * Buys workshops or products as gifts; values premium presentation.
   * Top goals: fast checkout, gifting flow, clear shipping/delivery info.

Design must address trust signals, easy onboarding, clear course outcomes and straightforward commerce flow.

---

## 4. Content Inventory (Observed & Recommended)

**Observed pages / sections** (from site crawl):

* Home (hero, trust badges, stats, CTA)
* Courses (grid of course cards with duration, lessons, rating)
* Shop (sourdough, pâtisserie, viennoiserie categories)
* Free Starter Guide lead magnet (email capture)
* Mentors / Instructors
* Student Stories / Testimonials / Social proof
* Journal (blog)
* About / Contact / FAQ / Legal pages (Privacy, TOS, Refund, Shipping)

**Recommended additions / clarifications:**

* Course detail pages with syllabus, sample video preview, curriculum, learning outcomes, prerequisites, certificate info.
* Onboarding flow for enrolled students (welcome email + dashboard links).
* Account dashboard (My courses, Certificates, Orders, Profile).
* Search and filters for courses (skill level, duration, topic, price).
* Clear shipping & perishable product policies for physical shop items.

---

## 5. Sitemap (logical)

* / (Home)
* /courses

  * /courses/[slug]
  * /courses/category/[category]
* /shop

  * /shop/[product-slug]
  * /cart
  * /checkout
* /resources/free-starter-guide
* /instructors
* /journal

  * /journal/[slug]
* /about
* /contact
* /faq
* /account

  * /account/courses
  * /account/orders
  * /account/profile
* /legal/privacy
* /legal/terms

---

## 6. Page-level Design Specifications

### 6.1 Home / Landing

**Purpose**: Introduce brand, communicate credibility, convert visitors to courses or lead magnet.
**Layout (desktop)**: Full-bleed hero image (baking photography) → value prop (H1) → two primary CTAs (Explore Courses / Get Free Guide) → trust badges & stats → featured courses carousel/grid → lead magnet email capture → instructor highlights → testimonials → footer.

**Hero**

* H1 size: large, multi-line (recommend 48–64px on desktop). Use tight leading for two-line headline.
* Subhead: concise value props (HD Video Lessons • Lifetime Access • Certificates).
* CTAs: Primary (solid, high-contrast), Secondary (ghost or outline).
* Background: high-quality warm photography with subtle dark overlay (30–45% black) to maintain text contrast.

**Featured courses grid**

* Card includes image, title, duration, lessons, rating, price badge, primary action (Enroll / View).
* Hover: raise elevation + reveal quick actions (Wishlist, Preview).

**Lead magnet**

* Compact form (email only) with privacy microcopy and visible CTA.

Accessibility

* Ensure hero text contrast passes AA.
* All images include alt text.

---

### 6.2 Courses Listing

**Layout**: Filter & search column at top (desktop: left filter pane / mobile: collapsible filter panel). Grid of course cards.
**Filters**: Skill level, duration, price, rating, category, language.
**Card Anatomy**: Thumbnail, tag (Bestseller/Free), title, short meta (weeks • lessons • rating), price, CTA.

---

### 6.3 Course Detail

**Primary goals**: persuade enrollment, clearly communicate syllabus/outcomes.
**Top section**: hero image/video preview, title, instructor, short outcomes, price, CTA (Enroll Now) and secondary CTA (View Curriculum).
**Curriculum**: collapsible module list with lesson duration; sample lesson video player (preview clip).
**Includes**: Student reviews, FAQ specific to the course, related courses.

Data model notes

* Course object: id, slug, title, price, duration, lessons[], preview_video_url, instructor_ids, level, language, certificate_flag.

---

### 6.4 Shop & Product Detail

**Shop grid**: categories (Sourdough, Pâtisserie, Viennoiserie, Featured), product cards (image, name, price, badge: Sold Out if applicable).
**Product detail**: gallery (lightbox), product description, ingredients/allergens, shipping or pickup options, add-to-cart, quantity, variant selector (size/flavor), recommended pairings.

Perishability & Shipping

* Display per-product shipping constraints (local pickup, cold-chain, non-shippable for perishable items). If shipping isn't supported, clearly state pickup options.

---

### 6.5 Cart & Checkout

**Cart**: line item list, price breakdown, promo code input, estimated shipping (if physical), secure checkout CTA.
**Checkout**: multi-step (Contact → Shipping → Payment → Review) OR single page if simpler. Keep form fields minimal and support address autocomplete.

Payment & Taxes

* Support Stripe (card+wallets) + region-specific tax calculation. Collect VAT/GST or local tax ID if needed for business accounts.

---

### 6.6 Account / Student Dashboard

**Sections**: My Courses (progress, resume links), Certificates, Orders, Profile, Payment methods.
**Course player**: resume on last watched lesson, progress percent, downloadable resources (PDF recipes), community/forum links.

---

### 6.7 Journal / Blog

**Purpose**: SEO content, community stories, recipes and how-tos.
**Layout**: article list with category filters, article detail with hero image, body, related recipes, CTA to related courses or shop items.

---

## 7. UI System & Component Library

Provide atomic components with accessible props. Deliver as React components + Tailwind-ready classes.

**Design tokens** (example)

* Color: --color-bg: #FFFFFF; --color-text: #1F2937; --color-accent: #B6743A (warm golden-brown accent suggestion); --color-accent-2: #7A4A2B; --color-muted: #6B7280
* Spacing: 4, 8, 12, 16, 24, 32, 48, 64
* Border radius: 6px / 12px for cards
* Typography scale: 16px base, 20px small, 24/32/40/56 for headings

**Typography (recommendations)**

* Headings: elegant serif for culinary feel (e.g., Playfair Display or Merriweather) for H1/H2.
* Body: neutral sans-serif (e.g., Inter or Roboto) for legibility.
* Line-height: 1.4–1.6 for body text.

**Core Components**

* Button (primary, secondary, ghost) — accessible focus ring, aria-label support
* Card (course, product) — image, title, meta, CTA
* Modal & Drawer — for video preview and mobile filters
* Form elements (inputs, selects, toggles) — labeled, error states, helper text
* Rating (stars) — include aria-hidden and numeric rating text for screen readers
* Notification / toast
* Breadcrumbs
* Pagination / infinite scroll toggle

**Accessibility details**

* Use semantic HTML (main, nav, header, footer, article, aside).
* All interactive elements keyboard-focusable and visible focus styles.
* Contrast: meet WCAG AA for text and large text; highlight areas requiring redesign if contrast fails.
* Skip-nav link.

---

## 8. Visual Design Guidelines

**Mood & Imagery**

* Warm, artisanal, editorial photography with shallow depth-of-field, natural tones and authentic process shots.
* Use full-bleed hero images with subtle overlays to anchor text.

**Color palette** (proposed)

* Primary background: #FFFFFF
* Primary text: #1F2937 (neutral charcoal)
* Accent warm: #B6743A (golden-brown)
* Secondary accent: #7A4A2B (deep brown)
* Muted gray: #6B7280

**Iconography**

* Use simple line icons with 2px stroke, rounded corners.

**Spacing & Rhythm**

* Maintain 8px grid for spacing. Use larger gutters on desktop (32–48px) and tighter on mobile (16px).

---

## 9. Interaction Patterns & Microcopy

* CTA labels: action-first and clear ("Enroll Now", "Get Free Guide", "Add to cart").
* Empty states: helpful copy and primary action (e.g., empty cart → "Continue shopping").
* Error handling: inline validation, clear error messages, and focus, on mobile expose error near field.
* Success flows: immediate toast and confirmation page + transactional email.

Video Player

* Player should support 1080p streaming, closed captions, playback speed, resume playback.
* Track analytics on lesson start, complete, 25/50/75% watched.

---

## 10. SEO & Content Recommendations

* Course pages: unique meta titles/descriptions, structured data (Course schema, Product schema, VideoObject for preview clips).
* Blog: recipe schema + step-by-step markup when applicable.
* Use canonical tags, sitemap.xml, robots.txt, and hreflang if supporting other languages.
* Performance: compress images (AVIF/WebP), lazy-load offscreen images, preconnect to 3rd-party video CDN.

---

## 11. Analytics & Events

**Core events**

* Page view
* Course impression (list)
* Course click / detail view
* Add to cart (course/shop)
* Checkout started / completed
* Lead magnet signup (email)
* Video started / completed / percent watched

**Tooling recommendations**

* GA4 for analytics, supplemented by server-side event collection for purchase events.
* Segment or RudderStack to centralize CDP and instrument downstream tools (email, CRM).

---

## 12. Performance & Security

**Targets**

* LCP < 2.5s, TTI < 3s (mobile real-world target), FCP < 1.8s.
* Lighthouse score: Performance ≥ 90, Accessibility ≥ 90.

**Tactics**

* Use Next.js with static rendering for marketing pages + incremental static regeneration for dynamic course data.
* Serve optimized images (srcset, AVIF/WebP), use responsive image sizes.
* Host media on a performant CDN (video on Vimeo Pro, Cloudflare Stream or Mux).
* Use HTTP security headers, CSP, and XSS protections.

---

## 13. Integration & Tech Recommendations

* **Frontend:** Next.js + React + Tailwind CSS. (Good SSR & SSG balance for SEO.)
* **LMS / Courses:** Consider integration with a SaaS LMS (Teachable/Thinkific) OR use custom course models served by headless CMS + video CDN.
* **Commerce:** Stripe + server-side order handling for e-receipts; Shopify headless if shop complexity increases.
* **CMS:** Sanity / Contentful / Strapi for editorial content (Journal, Instructor bios, FAQs).
* **Authentication:** Auth0 or NextAuth.js for account management.

---

## 14. Accessibility & Legal Requirements

* WCAG 2.1 AA conformance as minimum.
* Cookie consent for GDPR regions; privacy & TOS links visible in footer.
* All allergen and ingredient notes must be clearly visible on physical-product pages.

---

## 15. QA Checklist (Pre-launch)

* [ ] Lighthouse: Performance, Accessibility, Best Practices ≥ target
* [ ] Cross-browser checks (Chrome, Safari, Firefox) and major mobile browsers
* [ ] Keyboard-only navigation completed
* [ ] Forms: validation & error states
* [ ] Payments tested in sandbox + tax calculation verified
* [ ] Video playback & DRM checks
* [ ] Image alt text coverage
* [ ] SEO meta + structured data verified

---

## 16. Handoff & Deliverables

**Design assets**

* Figma design file with pages, components, tokens and redlines.
* Exportable component library with Tailwind tokens and example React components.
* Image asset catalog (src, alt text, usage guidelines).

**Documentation**

* This design specification (markdown/pdf).
* Implementation checklist and developer notes (endpoints, data contract samples).

---

## 17. Phase Roadmap & Prioritization

**Phase 1 (MVP - 6 weeks)**

* Core marketing pages, course listing & detail, lead magnet, basic shop (non-perishable or pickup-only), checkout flow, account login.
* Basic analytics & SEO.

**Phase 2 (6–12 weeks)**

* Student dashboard, course player, progress tracking, downloadable resources, advanced shop features, gift purchases.

**Phase 3 (ongoing)**

* Community features (forum), advanced personalization, marketing automation, multi-language support.

---

## 18. Open Questions & Risks

1. Will courses be hosted on-site or via 3rd-party LMS? Impacts authentication and DRM requirements.
2. Are physical shop items shippable internationally or local pickup only? Impacts logistics & checkout complexity.
3. What CMS will editors prefer? (Sanity/Contentful/Shopify/WordPress)

---

## 19. Appendix: Example Component Markup (annotated)

```jsx
// CourseCard (React + Tailwind example)
function CourseCard({ course }) {
  return (
    <article className="rounded-lg shadow-sm overflow-hidden bg-white">
      <img src={course.image} alt={course.title} className="w-full h-44 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-serif">{course.title}</h3>
        <p className="text-sm text-muted">{course.duration} • {course.lessons.length} lessons</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">{course.price}</span>
          <a href={`/courses/${course.slug}`} className="btn-primary">View</a>
        </div>
      </div>
    </article>
  )
}
```

---

### Final notes

This specification is intentionally thorough to support a high-fidelity implementation. If you want, I can convert this into a Figma-ready brief, generate a prioritized Jira backlog, or produce a developer-ready API contract next.

https://chatgpt.com/share/697e21b9-174c-8000-9a07-27b71ad3c0bf
