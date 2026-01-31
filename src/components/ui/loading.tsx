import { cn } from '@/lib/utils';

/**
 * Loading Components
 * 
 * Reusable loading indicators for various UI states.
 */

// ============================================
// Spinner
// ============================================

interface SpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'white';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Circular loading spinner
 */
export function Spinner({
  size = 'md',
  variant = 'primary',
  className,
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantClasses = {
    primary: 'text-crust-400',
    secondary: 'text-crust-600',
    white: 'text-white',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================
// Skeleton
// ============================================

interface SkeletonProps {
  /** Width of skeleton (can be CSS value) */
  width?: string;
  /** Height of skeleton (can be CSS value) */
  height?: string;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skeleton placeholder for loading content
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className,
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-crust-200',
        roundedClasses[rounded],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// ============================================
// Skeleton Variants
// ============================================

/**
 * Card skeleton for product cards, etc.
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <Skeleton height="200px" rounded="xl" />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
    </div>
  );
}

/**
 * Text skeleton for paragraphs
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * Page skeleton for full page loading
 */
export function PageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <Skeleton height="400px" rounded="2xl" />
      
      {/* Content sections */}
      <div className="space-y-4">
        <Skeleton width="300px" height="2rem" />
        <TextSkeleton lines={3} />
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

// ============================================
// Loading Overlay
// ============================================

interface LoadingOverlayProps {
  /** Whether to show the overlay */
  isLoading: boolean;
  /** Content to display under overlay */
  children: React.ReactNode;
  /** Loading message */
  message?: string;
}

/**
 * Loading overlay for sections
 */
export function LoadingOverlay({
  isLoading,
  children,
  message = 'Loading...',
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-crust-50/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <span className="text-sm text-crust-600">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Button Loading State
// ============================================

interface ButtonLoadingProps {
  /** Whether button is loading */
  isLoading: boolean;
  /** Button content (shown when not loading) */
  children: React.ReactNode;
  /** Loading text */
  loadingText?: string;
}

/**
 * Button content with loading state
 */
export function ButtonLoadingContent({
  isLoading,
  children,
  loadingText = 'Loading...',
}: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <>
        <Spinner size="sm" variant="white" className="mr-2" />
        {loadingText}
      </>
    );
  }
  return <>{children}</>;
}
