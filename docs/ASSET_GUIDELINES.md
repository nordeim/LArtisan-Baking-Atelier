# L'Artisan Baking Atelier - Asset Guidelines

## Image Asset Standards

### Product Images

| Type | Dimensions | Aspect Ratio | Format | Max Size |
|------|------------|--------------|--------|----------|
| Hero Image | 1200x1600px | 4:5 | WebP | 200KB |
| Gallery Image | 800x800px | 1:1 | WebP | 100KB |
| Thumbnail | 400x400px | 1:1 | WebP | 50KB |

**Naming Convention:**
```
{product-slug}-{type}-{variant}.{format}

Examples:
- artisan-sourdough-hero-01.webp
- artisan-sourdough-gallery-01.webp
- artisan-sourdough-thumb-01.webp
```

### Category Banners

| Type | Dimensions | Aspect Ratio | Format | Max Size |
|------|------------|--------------|--------|----------|
| Desktop Banner | 1920x600px | 16:5 | WebP | 300KB |
| Mobile Banner | 800x600px | 4:3 | WebP | 150KB |

**Naming Convention:**
```
category-{slug}-{viewport}.{format}

Examples:
- category-sourdough-desktop.webp
- category-sourdough-mobile.webp
```

### Instructor Portraits

| Type | Dimensions | Aspect Ratio | Format | Max Size |
|------|------------|--------------|--------|----------|
| Portrait | 800x1000px | 4:5 | WebP | 150KB |
| Avatar | 200x200px | 1:1 | WebP | 30KB |

**Naming Convention:**
```
instructor-{slug}-{type}.{format}

Examples:
- instructor-marie-claire-portrait.webp
- instructor-marie-claire-avatar.webp
```

### Brand Assets

| Asset | Dimensions | Format | Usage |
|-------|------------|--------|-------|
| Logo (Dark) | SVG | SVG | Header, dark backgrounds |
| Logo (Light) | SVG | SVG | Footer, light backgrounds |
| Favicon | 32x32px | ICO/PNG | Browser tab |
| Apple Touch Icon | 180x180px | PNG | iOS home screen |
| OG Image | 1200x630px | PNG | Social sharing |
| Twitter Card | 1200x600px | PNG | Twitter sharing |

### Blog Images

| Type | Dimensions | Aspect Ratio | Format | Max Size |
|------|------------|--------------|--------|----------|
| Cover Image | 1200x630px | 1.9:1 | WebP | 200KB |
| Inline Image | 800x600px | 4:3 | WebP | 150KB |
| Thumbnail | 400x300px | 4:3 | WebP | 50KB |

## Color Profile & Quality

- **Color Space:** sRGB
- **Color Profile:** sRGB IEC61966-2.1
- **WebP Quality:** 85%
- **JPEG Quality:** 90% (fallback only)

## Accessibility Requirements

- All images must have descriptive `alt` text
- Decorative images use empty `alt=""`
- Complex images (charts/diagrams) have extended descriptions
- Minimum contrast ratio for text overlays: 4.5:1

## Optimization Workflow

1. Source image (RAW/PSD) at 2x target resolution
2. Export at target dimensions
3. Convert to WebP using ImageMagick or Squoosh
4. Generate blur placeholder (LQIP)
5. Verify file size under maximum
6. Run through accessibility checker

## Tools

- **Conversion:** `cwebp`, ImageMagick, Squoosh
- **Optimization:** ImageOptim, TinyPNG
- **Placeholder Generation:** `lqip-modern`, `blurhash`
