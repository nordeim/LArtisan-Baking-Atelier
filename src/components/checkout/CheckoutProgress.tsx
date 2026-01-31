'use client';

import { Check, ShoppingCart, User, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Checkout Progress Component
 * 
 * Shows current step in checkout flow: Cart → Details → Payment
 */

type Step = 'cart' | 'details' | 'payment';

interface CheckoutProgressProps {
  currentStep: Step;
}

interface StepConfig {
  id: Step;
  label: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  { id: 'cart', label: 'Cart', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'details', label: 'Details', icon: <User className="w-4 h-4" /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    isCompleted && 'bg-sage-600 text-white',
                    isCurrent && 'bg-crust-900 text-white',
                    !isCompleted && !isCurrent && 'bg-crust-100 text-crust-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-1.5 font-medium',
                    isCompleted && 'text-sage-600',
                    isCurrent && 'text-crust-900',
                    !isCompleted && !isCurrent && 'text-crust-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 -mt-5',
                    index < currentIndex ? 'bg-sage-600' : 'bg-crust-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CheckoutProgress;
