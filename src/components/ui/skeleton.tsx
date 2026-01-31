/**
 * Skeleton Component
 * 
 * Loading placeholder with pulse animation.
 * Used throughout the app for loading states.
 */

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-crust-200', className)}
      {...props}
    />
  );
}

export default Skeleton;
