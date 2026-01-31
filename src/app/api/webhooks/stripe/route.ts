/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for payment processing.
 * Updates order status and stock quantities on successful payment.
 */

import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/webhooks/stripe
 * 
 * Handles Stripe webhook events.
 */
export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    const event = await constructWebhookEvent(payload, signature);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as {
          id: string;
          metadata?: Record<string, string>;
          receipt_email?: string;
          charges?: { data: Array<{ receipt_url?: string }> };
        };

        // Find the order by payment intent ID
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: paymentIntent.id },
          include: { orderItems: true },
        });

        if (!order) {
          console.error(`Order not found for payment intent: ${paymentIntent.id}`);
          return NextResponse.json({ received: true });
        }

        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
          },
        });

        // Decrement stock quantities
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        // TODO: Send order confirmation email
        console.log(`Order ${order.orderNumber} marked as paid`);

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as {
          id: string;
          last_payment_error?: { message?: string };
        };

        // Find and update the order
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'CANCELLED',
              paymentStatus: 'FAILED',
            },
          });

          console.log(`Order ${order.orderNumber} payment failed`);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

// Note: In Next.js App Router, body parsing is handled differently
// The raw body is available via request.text()
