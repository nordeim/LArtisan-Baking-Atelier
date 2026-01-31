# Phase 5: Section Components (Homepage) — DETAILED SUB-PLAN

## 📋 Executive Overview

**Phase Objective:** Build all section components for the homepage based on the "Editorial Patisserie" design from the static mockup. Each section transforms the static HTML into React components with animations, data fetching, and accessibility.

**Estimated Duration:** 4-5 days  
**Dependencies:** Phase 4 (Layout Components) must be complete  
**Prerequisites:** Database seeded, Prisma client ready, layout components working

**Success Criteria:**
- [ ] All 7 homepage sections render correctly
- [ ] Animations work (fade-up, float) with reduced motion support
- [ ] Data fetching from database works
- [ ] Responsive design at all breakpoints
- [ ] Accessibility: proper headings, ARIA labels, keyboard navigation
- [ ] Images load with Next.js Image optimization
- [ ] TypeScript compilation passes
- [ ] Manual testing on mobile, tablet, desktop

---

## 🗂️ Task Breakdown

### TASK 5.1: Hero Section

**Priority:** CRITICAL  
**Estimated Time:** 3-4 hours  
**Dependencies:** None

#### 5.1.1 HeroSection Component

**File:** `src/components/sections/HeroSection.tsx`

**Design Reference:** Static mockup lines 468-629

**Checklist:**

**Layout:**
- [ ] Asymmetric 2-column grid (`lg:grid-cols-2`)
- [ ] Gap: `gap-12 lg:gap-16`
- [ ] Max-width container with padding
- [ ] Overflow hidden for decorative elements

**Left Column (Content):**
- [ ] Eyebrow badge:
  - Text: "Singapore's Premier Baking Academy"
  - Style: `inline-flex`, pill shape, `bg-crust-100`, `border-crust-200`
  - Animated dot indicator (pulse)
  - `animate-fade-up` with 100ms delay
- [ ] Main headline:
  - Text: "Master the Art of Baking"
  - Font: `font-display text-5xl lg:text-7xl`
  - "Art" with gradient text effect
  - Decorative underline SVG under "Art"
  - `animate-fade-up` with 200ms delay
- [ ] Subheading paragraph:
  - Text about world-class instructors
  - Max-width for readability
  - `text-lg text-crust-600`
  - `animate-fade-up` with 300ms delay
- [ ] Social proof stats:
  - Avatar group (4 overlapping circles)
  - "15,000+ Students" counter
  - "4.9 Rating" with star icon
  - "94% Completion"
  - `animate-fade-up` with 400ms delay
- [ ] CTA buttons:
  - Primary: "Explore Shop" with arrow icon, `bg-crust-400`
  - Secondary: "Watch Trailer" with play icon, outlined
  - `animate-fade-up` with 500ms delay
- [ ] Trust badges:
  - "Trusted by" label
  - Partner logos/text: Le Cordon Bleu, Michelin Guide, World Pastry Cup
  - Grayscale effect with hover color
  - `animate-fade-up` with 600ms delay

**Right Column (Visual):**
- [ ] Main hero image:
  - Aspect ratio `aspect-[4/5]`
  - Next.js Image component with priority loading
  - Rounded corners `rounded-3xl`
  - Shadow `shadow-elevated`
  - Gradient overlay from bottom
  - `animate-scale-in` with 300ms delay
- [ ] Floating stats card (left side):
  - "50+ Countries" with globe icon
  - `absolute -left-8 top-1/4`
  - Hidden on mobile (`hidden lg:block`)
  - `animate-float` with 0.5s delay
- [ ] Floating testimonial card (right side):
  - 5-star rating
  - Quote preview
  - Hidden on mobile
  - `animate-float` with 1s delay
- [ ] Floating certification badge (bottom of image):
  - "Industry Certified" text
  - Certificate icon
  - Glass panel effect

**Decorative Elements:**
- [ ] Background gradient blobs (blurred circles)
- [ ] Positioned absolutely
- [ ] Pointer events none
- [ ] Subtle opacity

**Accessibility:**
- [ ] `aria-labelledby` on section
- [ ] Heading IDs for screen readers
- [ ] Alt text on hero image
- [ ] Button focus states

**Props Interface:**
```typescript
interface HeroSectionProps {
  // No props - data is static
}
```

---

### TASK 5.2: Trust Bar

**Priority:** HIGH  
**Estimated Time:** 1-2 hours  
**Dependencies:** None

#### 5.2.1 TrustBar Component

**File:** `src/components/sections/TrustBar.tsx`

**Design Reference:** Static mockup lines 634-679

**Checklist:**

**Layout:**
- [ ] Full-width dark background (`bg-crust-900`)
- [ ] Container with padding (`py-12`)
- [ ] 4-column grid on desktop (`lg:grid-cols-4`)
- [ ] 2-column on mobile (`grid-cols-2`)
- [ ] Gap between items

**Feature Items (4 total):**
Each item includes:
- [ ] Icon container:
  - `w-12 h-12`
  - `bg-crust-800 rounded-xl`
  - Icon: Lucide icon (Video, Clock, Users, Award)
  - Icon color: `text-crust-400`
- [ ] Heading:
  - Text: "HD Video Lessons", "Lifetime Access", "Community Forum", "Certificates"
  - Style: `font-semibold text-crust-100`
- [ ] Description:
  - Short subtitle text
  - Style: `text-sm text-crust-400`

**Responsive:**
- [ ] Centered text on all breakpoints
- [ ] Icons centered above text
- [ ] Adequate spacing on mobile

**Props Interface:**
```typescript
interface TrustBarProps {
  // No props - static content
}
```

---

### TASK 5.3: Featured Products Section

**Priority:** CRITICAL  
**Estimated Time:** 4-5 hours  
**Dependencies:** Database with products

#### 5.3.1 FeaturedProducts Component

**File:** `src/components/sections/FeaturedProducts.tsx`

**Design Reference:** Static mockup lines 684-988

**Checklist:**

**Section Header:**
- [ ] Badge: "Our Courses" / "Featured Products"
  - Pill shape, `bg-crust-200`, uppercase
- [ ] Heading: "Discover Your Baking Journey"
  - `font-display text-display-lg`
- [ ] Description paragraph
- [ ] `reveal` class for scroll animation

**Bento Grid Layout:**
- [ ] CSS Grid with `grid-template-columns`
- [ ] Mobile: single column
- [ ] Tablet: 2 columns
- [ ] Desktop: 3 columns with featured spanning
- [ ] Featured card: `col-span-2 row-span-2`
- [ ] Gap: `gap-6`

**Product Cards (5+ cards):**

**Card Structure:**
- [ ] Container: `bg-white rounded-3xl shadow-card`
- [ ] Hover effect: `card-lift` (translate-y + shadow)
- [ ] Link wrapper for entire card

**Image Area:**
- [ ] Aspect ratio container
- [ ] Next.js Image with lazy loading
- [ ] Gradient overlay from bottom
- [ ] Badges positioned absolute:
  - Level badge (Beginner/Intermediate/Advanced) - top-left
  - Sale badge - top-right (if applicable)
- [ ] Image zoom on hover

**Content Area:**
- [ ] Level indicator (small text)
- [ ] Product name (heading)
- [ ] Description (2-line clamp)
- [ ] Meta info:
  - Duration with clock icon
  - Lesson count with video icon
  - Rating with star icon
- [ ] Price area:
  - Current price (large, bold)
  - Original price with strikethrough (if on sale)
- [ ] CTA button: "Enroll Now" / "View Course"

**Featured Card (Special):**
- [ ] Larger image area
- [ ] Content overlaid on image (bottom)
- [ ] White text on dark gradient
- [ ] "Bestseller" badge
- [ ] "Save X%" badge

**View All Link:**
- [ ] "View All Courses" link
- [ ] Arrow icon with hover animation
- [ ] Centered below grid

**Data Fetching:**
- [ ] Server Component (async)
- [ ] Fetch from database:
  ```typescript
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isAvailable: true },
    take: 5,
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  ```

**Props Interface:**
```typescript
interface FeaturedProductsProps {
  products: ProductWithCategory[];
}
```

---

### TASK 5.4: Free Guide CTA Section

**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Dependencies:** None

#### 5.4.1 FreeGuideCTA Component

**File:** `src/components/sections/FreeGuideCTA.tsx`

**Design Reference:** Static mockup lines 993-1099

**Checklist:**

**Layout:**
- [ ] Dark gradient background (`bg-gradient-to-br from-crust-800 via-crust-900 to-crust-950`)
- [ ] Decorative dots pattern (subtle opacity)
- [ ] 2-column grid on desktop
- [ ] Stacked on mobile

**Left Column (Content):**
- [ ] Badge: "Free Download" with gift icon
- [ ] Heading: "Start Your Sourdough Journey Today"
  - Large display text
  - White color
- [ ] Description paragraph
  - Muted text color
- [ ] Feature checklist:
  - Checkmark icons (Lucide Check)
  - 3-4 bullet points
  - "Step-by-step starter cultivation"
  - "Common mistakes & how to fix them"
  - "Pro tips from our master bakers"

**Email Form:**
- [ ] Email input field:
  - Dark background (`bg-crust-800`)
  - Border (`border-crust-700`)
  - Placeholder text
  - Rounded corners
  - Focus ring
- [ ] Submit button:
  - "Get Free Guide" text
  - Primary CTA styling
  - Loading state support
- [ ] Privacy note:
  - Small text
  - Link to Privacy Policy
- [ ] Form validation (client-side)
- [ ] Success/error states

**Right Column (Visual):**
- [ ] Book mockup:
  - CSS-only book design (gradient backgrounds)
  - "The Sourdough Starter Guide" title
  - "32 Pages • Free PDF" badge
  - Rotation transform for 3D effect
- [ ] Floating "FREE" badge:
  - Circular, animated float
  - Positioned absolute

**Animation:**
- [ ] Scroll-triggered reveal
- [ ] Book hover effect (rotate)

**Props Interface:**
```typescript
interface FreeGuideCTAProps {
  // No props - static content with form
}
```

---

### TASK 5.5: Instructors Section

**Priority:** MEDIUM  
**Estimated Time:** 2-3 hours  
**Dependencies:** None

#### 5.5.1 InstructorsSection Component

**File:** `src/components/sections/InstructorsSection.tsx`

**Design Reference:** Static mockup lines 1104-1188

**Checklist:**

**Section Header:**
- [ ] Badge: "Your Mentors"
- [ ] Heading: "Learn From World-Class Artisans"
- [ ] Description about instructors

**Instructor Grid:**
- [ ] 3-column grid on desktop
- [ ] 2-column on tablet
- [ ] 1-column on mobile
- [ ] Gap: `gap-8`

**Instructor Cards (3 cards):**

**Card Structure:**
- [ ] Image container:
  - Aspect ratio `aspect-[3/4]`
  - Rounded corners `rounded-3xl`
  - Overflow hidden
  - Next.js Image
- [ ] Gradient overlay (bottom)
- [ ] Text overlay (bottom-left):
  - Name (large, white)
  - Title/Location (smaller, muted)
- [ ] Skill tags (below image):
  - Flex wrap
  - Pill-shaped badges
  - `bg-crust-100 text-crust-700`

**Instructor Data:**
1. Marie-Claude Dubois - Master Pâtissier • Paris
   - Tags: Pâtisserie, Chocolate, 25 yrs exp
2. Marco Bellini - Bread Artisan • Milan
   - Tags: Sourdough, Artisan Bread, 22 yrs exp
3. Yuki Tanaka - Viennoiserie Expert • Tokyo
   - Tags: Viennoiserie, Lamination, 18 yrs exp

**Hover Effects:**
- [ ] Image zoom on hover
- [ ] Shadow increase

**Props Interface:**
```typescript
interface InstructorsSectionProps {
  // No props - static content
}
```

---

### TASK 5.6: Testimonials Section

**Priority:** MEDIUM  
**Estimated Time:** 2-3 hours  
**Dependencies:** None

#### 5.6.1 TestimonialsSection Component

**File:** `src/components/sections/TestimonialsSection.tsx`

**Design Reference:** Static mockup lines 1193-1277

**Checklist:**

**Section Header:**
- [ ] Badge: "Student Stories"
- [ ] Heading: "Transforming Bakers Worldwide"

**Testimonials Grid:**
- [ ] Light background (`bg-crust-100`)
- [ ] 3-column grid on desktop
- [ ] 1-column on mobile
- [ ] Gap: `gap-8`

**Testimonial Cards (3 cards):**

**Card Structure:**
- [ ] White background
- [ ] Rounded corners `rounded-3xl`
- [ ] Shadow `shadow-card`
- [ ] Padding

**Card Content:**
- [ ] 5-star rating display:
  - Star icons (filled)
  - Color: `text-crust-400`
- [ ] Quote text:
  - Large quotation mark decoration
  - Italic style
  - Proper spacing
- [ ] Author info:
  - Avatar (initials or image)
  - Name
  - Location/role

**Testimonial Data:**
1. Sarah Mitchell - Home Baker • Melbourne, AU
   - "The Sourdough Mastery course completely transformed my understanding..."
2. James Kim - Café Owner • Singapore
   - "After taking the Viennoiserie course, I opened my own croissant café..."
3. Elena Petrova - Pastry Chef • Berlin, DE
   - "The community forum is incredible — I've connected with bakers from 30+ countries..."

**Decorative Element:**
- [ ] Large quotation mark as background decoration
- [ ] Positioned absolute
- [ ] Low opacity

**Props Interface:**
```typescript
interface TestimonialsSectionProps {
  // No props - static content
}
```

---

### TASK 5.7: Final CTA Section

**Priority:** MEDIUM  
**Estimated Time:** 1-2 hours  
**Dependencies:** None

#### 5.7.1 FinalCTA Component

**File:** `src/components/sections/FinalCTA.tsx`

**Design Reference:** Static mockup lines 1282-1308

**Checklist:**

**Layout:**
- [ ] Centered content
- [ ] Max-width container
- [ ] Padding

**Content:**
- [ ] Heading: "Ready to Begin Your Baking Journey?"
  - Large display text
  - Centered
- [ ] Description:
  - "Join 15,000+ students mastering the art of baking..."
  - Centered
  - Max-width for readability

**CTA Buttons:**
- [ ] Primary: "Explore Courses"
  - Large size
  - Arrow icon
  - `bg-crust-400`
- [ ] Secondary: "Get Free Guide"
  - Outlined style
  - `bg-crust-100`

**Trust Badges:**
- [ ] "30-day money-back guarantee"
- [ ] "Lifetime access"
- [ ] "Industry-recognized certificates"
- [ ] Small text, centered

**Props Interface:**
```typescript
interface FinalCTAProps {
  // No props - static content
}
```

---

### TASK 5.8: Homepage Integration

**Priority:** CRITICAL  
**Estimated Time:** 1-2 hours  
**Dependencies:** All section components

#### 5.8.1 Homepage Assembly

**File:** `src/app/(store)/page.tsx`

**Checklist:**

**Data Fetching:**
- [ ] Import `prisma` from `@/lib/prisma`
- [ ] Create `getFeaturedProducts()` function
- [ ] Fetch featured products from database
- [ ] Handle errors gracefully

**Component Composition:**
```tsx
export default async function HomePage() {
  const products = await getFeaturedProducts();
  
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedProducts products={products} />
      <FreeGuideCTA />
      <InstructorsSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
```

**Error Handling:**
- [ ] Try-catch around data fetching
- [ ] Fallback UI if database fails
- [ ] Empty state if no featured products

**Performance:**
- [ ] Use Next.js Image for all images
- [ ] Lazy load below-fold sections
- [ ] Priority loading for hero image

---

## ✅ Phase 5 Integration Checklist

### Pre-Flight Verification
- [ ] Phase 4 complete (layout working)
- [ ] Database seeded with products
- [ ] Images available (Unsplash URLs in seed data)
- [ ] Prisma client generated

### Component Development
- [ ] HeroSection created with all elements
- [ ] TrustBar created with 4 features
- [ ] FeaturedProducts created with bento grid
- [ ] FreeGuideCTA created with form
- [ ] InstructorsSection created
- [ ] TestimonialsSection created
- [ ] FinalCTA created

### Data Integration
- [ ] Homepage fetches products from database
- [ ] Featured products display correctly
- [ ] Images load properly
- [ ] Empty states handled

### Styling & Animation
- [ ] All sections use correct Tailwind classes
- [ ] Animations work (fade-up, float, scale-in)
- [ ] Reduced motion supported
- [ ] Responsive at all breakpoints

### Accessibility
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] ARIA labels on interactive elements
- [ ] Focus visible states
- [ ] Alt text on images
- [ ] Color contrast meets WCAG AA

### Validation Commands (Run These)
```bash
# 1. Type checking
npm run type-check
# Expected: No errors

# 2. Build
npm run build
# Expected: Build succeeds

# 3. Development server
npm run dev
# Expected: Homepage renders with all sections

# 4. Manual testing:
# - Visit http://localhost:3000
# - Scroll through all sections
# - Test mobile responsive
# - Check animations
# - Test form submission
```

### Manual Verification Checklist
- [ ] Hero section visible on load
- [ ] Hero animations play on load
- [ ] Scroll reveals sections
- [ ] Trust bar displays 4 features
- [ ] Featured products grid shows products
- [ ] Product cards hover correctly
- [ ] Free guide CTA form works
- [ ] Instructors section shows 3 cards
- [ ] Testimonials show 3 cards
- [ ] Final CTA buttons visible
- [ ] Footer visible at bottom
- [ ] No console errors
- [ ] Mobile view works correctly

---

## 📊 Phase 5 Completion Criteria

**Definition of Done:**
1. All 7 homepage sections render correctly
2. Data fetching from database works
3. Animations are smooth and respect reduced motion
4. Responsive design works on all devices
5. Accessibility requirements met
6. Build succeeds without errors
7. Manual testing passes
8. Homepage matches design mockup

**Next Phase Trigger:**
Once all criteria above are met, proceed to **Phase 6: Shop & Product Pages**

---

## 🎨 Design Tokens Reference

### Colors
- Background: `bg-crust-50` (light), `bg-crust-900` (dark)
- Text: `text-crust-900` (primary), `text-crust-600` (secondary)
- Accent: `bg-crust-400` (CTA), `text-crust-400` (icons)

### Typography
- Display: `font-display text-5xl lg:text-7xl`
- Heading: `font-display text-display-lg`
- Body: `font-body text-lg`

### Spacing
- Section padding: `py-20 lg:py-28`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid gap: `gap-6` or `gap-8`

### Animations
- Fade up: `animate-fade-up` (0.6s ease-out)
- Float: `animate-float` (6s ease-in-out infinite)
- Scale in: `animate-scale-in` (0.4s ease-out)
- Card lift: `card-lift` (translate-y + shadow on hover)

---

## 🖼️ Image Requirements

| Section | Images | Loading |
|---------|--------|---------|
| Hero | Main sourdough image | `priority` |
| Featured Products | Product images | `lazy` |
| Instructors | 3 portrait photos | `lazy` |

All images use Next.js `Image` component with:
- Proper `width` and `height`
- `alt` text
- `sizes` attribute for responsive

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Author:** Master Architect
