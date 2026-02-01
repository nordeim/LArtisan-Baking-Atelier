'use client';

// ============================================
// L'Artisan Baking Atelier - Progress Ring
// Circular progress indicator for course completion
// ============================================

import { cn } from '@/lib/utils';

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressRing({
  percent,
  size = 80,
  strokeWidth = 6,
  className,
  showPercentage = true,
}: ProgressRingProps) {
  // Ensure percent is between 0 and 100
  const normalizedPercent = Math.min(Math.max(percent, 0), 100);
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedPercent / 100) * circumference;
  
  // Determine color based on progress
  const isComplete = normalizedPercent === 100;
  const strokeColor = isComplete ? 'var(--color-sage-500)' : 'var(--color-crust-400)';
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-crust-200)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {showPercentage && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-crust-800">
          {Math.round(normalizedPercent)}%
        </span>
      )}
      
      {isComplete && (
        <div className="absolute -top-1 -right-1">
          <svg className="w-5 h-5 text-sage-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}
