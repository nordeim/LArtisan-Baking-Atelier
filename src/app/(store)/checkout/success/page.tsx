/**
 * Checkout Success Page
 * 
 * Displayed after successful payment.
 * Shows order confirmation and next steps.
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Mail, Package, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

/**
 * Success Content Component
 * 
 * Uses useSearchParams which must be wrapped in Suspense
 */
function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Try to get order number from URL or localStorage
  useEffect(() => {
    // Check URL params first
    const urlOrderNumber = searchParams.get('order');
    if (urlOrderNumber) {
      setOrderNumber(urlOrderNumber);
      return;
    }

    // Try to get from localStorage (set during checkout)
    try {
      const pendingOrder = localStorage.getItem('pending-order');
      if (pendingOrder) {
        const order = JSON.parse(pendingOrder);
        setOrderNumber(order.orderNumber);
        // Clear pending order
        localStorage.removeItem('pending-order');
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-crust-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-card">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-sage-600" />
            </div>

            {/* Heading */}
            <h1 className="font-display text-3xl font-semibold text-crust-900 mb-3">
              Order Confirmed!
            </h1>

            <p className="text-crust-600 mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>

            {/* Order Number */}
            {orderNumber && (
              <div className="bg-crust-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-crust-500 mb-1">Order Number</p>
                <p className="font-mono text-lg font-semibold text-crust-900">
                  {orderNumber}
                </p>
              </div>
            )}

            {/* Email Confirmation */}
            <div className="flex items-center justify-center gap-3 text-sm text-crust-600 mb-8">
              <Mail className="w-5 h-5 text-crust-400" />
              <span>A confirmation email has been sent to your inbox</span>
            </div>

            <Separator className="mb-8" />

            {/* What's Next */}
            <div className="text-left space-y-4 mb-8">
              <h2 className="font-display text-lg font-semibold text-crust-900">
                What&apos;s Next?
              </h2>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-crust-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-crust-600" />
                </div>
                <div>
                  <p className="font-medium text-crust-900">Check Your Email</p>
                  <p className="text-sm text-crust-600">
                    You&apos;ll receive an email with your order details and access instructions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-crust-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-crust-600" />
                </div>
                <div>
                  <p className="font-medium text-crust-900">Access Your Courses</p>
                  <p className="text-sm text-crust-600">
                    Log into your account to start learning immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-crust-100 flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-crust-600" />
                </div>
                <div>
                  <p className="font-medium text-crust-900">Download Resources</p>
                  <p className="text-sm text-crust-600">
                    Access recipe cards, guides, and bonus materials.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/account/courses" className="flex-1">
                <Button className="w-full">Go to My Courses</Button>
              </Link>
              <Link href="/shop" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Support */}
          <p className="text-center text-sm text-crust-500 mt-6">
            Have questions?{' '}
            <Link href="/contact" className="text-crust-700 hover:text-crust-900 underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

/**
 * Checkout Success Page
 * 
 * Wraps SuccessContent in Suspense for useSearchParams
 */
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-crust-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-crust-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-crust-400" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-crust-900 mb-3">
              Order Confirmed!
            </h1>
            <p className="text-crust-600">Loading order details...</p>
          </div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
