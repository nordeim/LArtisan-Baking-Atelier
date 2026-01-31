# ============================================
# L'Artisan Baking Atelier - Production Dockerfile
# Multi-stage build for optimized production image
# ============================================

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

# Install libc6-compat for Alpine (required for some native modules)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
# Use --frozen-lockfile for reproducible builds
RUN npm ci --only=production --frozen-lockfile && npm cache clean --force

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package.json package-lock.json* ./

# Install dev dependencies for build
RUN npm ci --frozen-lockfile

# Copy all source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ============================================
# Stage 3: Runner (Production)
# ============================================
FROM node:20-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma files (for migrations if needed)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy standalone build output
# Next.js standalone output includes server.js and necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]

# ============================================
# Development Target (for docker-compose dev)
# ============================================
FROM node:20-alpine AS dev

WORKDIR /app

# Install all dependencies (including dev)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy prisma for generation
COPY prisma ./prisma
RUN npx prisma generate

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]
