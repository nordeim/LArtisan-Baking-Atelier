/**
 * Checkout Page
 * 
 * Multi-step checkout flow: Details → Payment.
 * Redirects to shop if cart is empty.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { useCart } from '@/hooks/useCart';
import { getStripe } from '@/lib/stripe';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { EmptyCheckout } from '@/components/checkout/EmptyCheckout';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';
import type { CustomerInfo } from '@/lib/validation/checkout';

// ============================================
// Types
// ============================================

type CheckoutStep = 'details' | 'payment' | 'processing';

// ============================================
// Main Page Component
// ============================================

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, isLoading, validateStock, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof getStripe> | null>(null);

  // Redirect if cart is empty after loading
  useEffect(() => {
    if (!isLoading && items.length === 0 && currentStep !== 'processing') {
      // Don't redirect immediately, let EmptyCheckout render
    }
  }, [items.length, isLoading, currentStep]);

  // Initialize Stripe on mount
  useEffect(() => {
    setStripePromise(getStripe());
  }, []);

  // Stripe Elements options
  const elementsOptions: StripeElementsOptions | undefined = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3d2b1f',
            colorBackground: '#ffffff',
            colorText: '#3d2b1f',
            colorDanger: '#ef4444',
            borderRadius: '8px',
          },
        },
      }
    : undefined;

  // Handle form submission
  const handleDetailsSubmit = async (data: CustomerInfo) => {
    setError(null);
    setIsSubmitting(true);
    
    // Validate stock before proceeding
    const { valid, errors } = validateStock();
    if (!valid) {
      setError(`Stock issues: ${errors.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create payment intent
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: data,
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const result = await response.json();
      
      setClientSecret(result.clientSecret);
      setCurrentStep('payment');
      
      // Store order info for success page
      localStorage.setItem('pending-order', JSON.stringify({
        orderNumber: result.orderNumber,
        orderId: result.orderId,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    clearCart();
    router.push('/checkout/success');
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-crust-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-crust-200 rounded w-1/3"></div>
              <div className="h-4 bg-crust-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show empty cart state
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-crust-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyCheckout />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-crust-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-crust-600 hover:text-crust-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-crust-900">
              Checkout
            </h1>
            <p className="text-crust-600 mt-2">
              Complete your purchase securely
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <CheckoutProgress 
              currentStep={currentStep === 'processing' ? 'payment' : currentStep} 
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-card">
                {currentStep === 'details' && (
                  <CheckoutForm
                    onSubmit={handleDetailsSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}

                {currentStep === 'payment' && clientSecret && stripePromise && elementsOptions && (
                  <Elements stripe={stripePromise} options={elementsOptions}>
                    <StripePaymentForm
                      amount={totals.total}
                      onSuccess={handlePaymentSuccess}
                      onBack={() => setCurrentStep('details')}
                    />
                  </Elements>
                )}

                {currentStep === 'processing' && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-crust-200 border-t-crust-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-crust-600">Processing your order...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
