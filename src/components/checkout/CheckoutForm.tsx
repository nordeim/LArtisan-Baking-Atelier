'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { customerInfoSchema, type CustomerInfo } from '@/lib/validation/checkout';
import { cn } from '@/lib/utils';

/**
 * Checkout Form Component
 * 
 * Customer information form with PDPA-compliant data collection.
 */

interface CheckoutFormProps {
  onSubmit: (data: CustomerInfo) => void;
  isSubmitting?: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting = false }: CheckoutFormProps) {
  const [showMarketingInfo, setShowMarketingInfo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      marketingConsent: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-crust-900">
        Contact Information
      </h2>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
          className={cn(errors.email && 'border-red-500')}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
        <p className="text-xs text-crust-500">
          We&apos;ll send your order confirmation here
        </p>
      </div>

      <Separator />

      <h2 className="font-display text-xl font-semibold text-crust-900">
        Billing Details
      </h2>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            autoComplete="given-name"
            {...register('firstName')}
            className={cn(errors.firstName && 'border-red-500')}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            autoComplete="family-name"
            {...register('lastName')}
            className={cn(errors.lastName && 'border-red-500')}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="9123 4567"
          autoComplete="tel"
          {...register('phone')}
          className={cn(errors.phone && 'border-red-500')}
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        )}
        <p className="text-xs text-crust-500">
          Singapore phone number (8 digits, starts with 6, 8, or 9)
        </p>
      </div>

      <Separator />

      {/* Marketing Consent */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="marketingConsent"
            {...register('marketingConsent')}
          />
          <div className="space-y-1">
            <Label
              htmlFor="marketingConsent"
              className="text-sm font-normal cursor-pointer"
            >
              I would like to receive emails about new courses, promotions, and baking tips
            </Label>
            <button
              type="button"
              onClick={() => setShowMarketingInfo(!showMarketingInfo)}
              className="flex items-center gap-1 text-xs text-crust-500 hover:text-crust-700"
            >
              <Info className="w-3 h-3" />
              {showMarketingInfo ? 'Hide' : 'Learn more'}
            </button>
          </div>
        </div>

        {showMarketingInfo && (
          <div className="p-3 bg-crust-50 rounded-lg text-sm text-crust-600">
            <p>
              You can unsubscribe at any time. We respect your privacy and will never 
              share your information with third parties. See our{' '}
              <a href="/privacy" className="text-crust-900 underline hover:no-underline">
                Privacy Policy
              </a>{' '}
              for more details.
            </p>
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <p className="text-xs text-crust-500">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-crust-900 underline hover:no-underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-crust-900 underline hover:no-underline">
          Privacy Policy
        </a>
        . Your information is processed in accordance with Singapore&apos;s PDPA.
      </p>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Continue to Payment'
        )}
      </Button>
    </form>
  );
}

export default CheckoutForm;
