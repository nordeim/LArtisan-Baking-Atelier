'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TEST_CARDS } from '@/lib/stripe';

/**
 * Stripe Payment Form Component
 * 
 * Handles card input and payment submission using Stripe Elements.
 */

interface StripePaymentFormProps {
  /** Order total in cents */
  amount: number;
  /** Callback on successful payment */
  onSuccess: () => void;
  /** Callback to go back to details */
  onBack: () => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export function StripePaymentForm({
  amount,
  onSuccess,
  onBack,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTestCards, setShowTestCards] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setStatus('processing');
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
    } else if (paymentIntent) {
      if (paymentIntent.status === 'succeeded') {
        setStatus('success');
        onSuccess();
      } else if (paymentIntent.status === 'requires_action') {
        // 3D Secure authentication required
        // Stripe.js will handle the redirect automatically
        setStatus('processing');
      } else {
        setStatus('error');
        setErrorMessage('Payment could not be completed. Please try again.');
      }
    }
  };

  // Format amount for display
  const displayAmount = (amount / 100).toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-crust-900">
        Payment Details
      </h2>

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Stripe Payment Element */}
      <div className="p-4 border border-crust-200 rounded-lg bg-white">
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                name: '',
              },
            },
          }}
        />
      </div>

      {/* Test Mode Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 bg-crust-50 rounded-lg">
          <button
            type="button"
            onClick={() => setShowTestCards(!showTestCards)}
            className="text-sm text-crust-600 hover:text-crust-900 underline"
          >
            {showTestCards ? 'Hide' : 'Show'} test card numbers
          </button>

          {showTestCards && (
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-medium text-crust-900">Test Cards:</p>
              <div className="space-y-1 text-crust-600">
                <p>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border">
                    {TEST_CARDS.SUCCESS}
                  </span>{' '}
                  - Successful payment
                </p>
                <p>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border">
                    {TEST_CARDS.AUTH_REQUIRED}
                  </span>{' '}
                  - Requires 3D Secure
                </p>
                <p>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border">
                    {TEST_CARDS.DECLINED}
                  </span>{' '}
                  - Declined payment
                </p>
              </div>
              <p className="text-xs text-crust-500 mt-2">
                Use any future expiry date and any 3-digit CVC.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center gap-2 text-xs text-crust-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Your payment is secured by Stripe. We never store your card details.</span>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={status === 'processing'}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || status === 'processing'}
          className="flex-1"
          size="lg"
        >
          {status === 'processing' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : status === 'success' ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Payment Complete
            </>
          ) : (
            `Pay S$${displayAmount}`
          )}
        </Button>
      </div>
    </form>
  );
}

export default StripePaymentForm;
