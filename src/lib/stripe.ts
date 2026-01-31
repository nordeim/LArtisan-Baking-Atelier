/**
 * Stripe Configuration
 * 
 * Server-side and client-side Stripe configuration.
 * Handles payment processing with Singapore GST.
 */

import Stripe from 'stripe';
import { loadStripe, type Stripe as StripeJS } from '@stripe/stripe-js';

// ============================================
// Server-side Stripe
// ============================================

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-01-28.clover' as Stripe.LatestApiVersion,
  typescript: true,
});

// ============================================
// Client-side Stripe
// ============================================

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<StripeJS | null> | null = null;

/**
 * Get Stripe instance for client-side
 * 
 * @returns Stripe instance promise
 */
export function getStripe(): Promise<StripeJS | null> {
  if (!stripePromise) {
    if (!stripePublishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
}

// ============================================
// Payment Intent Configuration
// ============================================

/**
 * Payment intent options
 */
export interface CreatePaymentIntentOptions {
  /** Amount in cents */
  amount: number;
  /** Currency code (default: sgd) */
  currency?: string;
  /** Customer email */
  email?: string;
  /** Order metadata */
  metadata?: Record<string, string>;
}

/**
 * Create a payment intent
 * 
 * @param options - Payment intent options
 * @returns Payment intent client secret
 */
export async function createPaymentIntent(
  options: CreatePaymentIntentOptions
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const { amount, currency = 'sgd', email, metadata } = options;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    receipt_email: email,
    metadata,
  });

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to create payment intent: no client secret returned');
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}

// ============================================
// Webhook Configuration
// ============================================

/**
 * Webhook event types we handle
 */
export const WEBHOOK_EVENTS = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
] as const;

/**
 * Verify webhook signature
 * 
 * @param payload - Raw request body
 * @param signature - Stripe signature header
 * @returns Verified event
 */
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// ============================================
// Test Cards
// ============================================

/**
 * Stripe test card numbers for development
 */
export const TEST_CARDS = {
  /** Successful payment */
  SUCCESS: '4242 4242 4242 4242',
  /** Requires authentication (3D Secure) */
  AUTH_REQUIRED: '4000 0025 0000 3155',
  /** Declined payment */
  DECLINED: '4000 0000 0000 0002',
  /** Insufficient funds */
  INSUFFICIENT_FUNDS: '4000 0000 0000 9995',
} as const;
