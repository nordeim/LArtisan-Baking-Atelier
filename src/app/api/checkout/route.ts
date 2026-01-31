/**
 * Checkout API Route
 * 
 * Creates Stripe payment intent for checkout.
 * Validates cart and customer information.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { checkoutSchema } from '@/lib/validation/checkout';

/**
 * POST /api/checkout
 * 
 * Creates a payment intent for the checkout process.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid checkout data',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { customer, items } = validationResult.data;

    // Fetch products from database to verify prices and stock
    const productIds = items.map((item) => item.id);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isAvailable: true,
      },
    });

    // Verify all products exist and are available
    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Some products are no longer available' },
        { status: 400 }
      );
    }

    // Create product lookup map
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calculate order total and validate stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.id);

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 400 }
        );
      }

      // Check stock availability
      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Only ${product.stockQuantity} available.`,
          },
          { status: 400 }
        );
      }

      const price = Number(product.price);
      subtotal += price * item.quantity;

      orderItems.push({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: price,
        gstRate: 0.09,
        total: price * item.quantity,
        productName: product.name,
        productSku: product.sku,
        productImage: product.images[0] || null,
      });
    }

    // Calculate GST (9%)
    const gstRate = 0.09;
    const gstAmount = Math.round(subtotal * gstRate);
    const total = subtotal + gstAmount;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create payment intent
    const { clientSecret, paymentIntentId } = await createPaymentIntent({
      amount: total,
      currency: 'sgd',
      email: customer.email,
      metadata: {
        orderNumber,
        customerEmail: customer.email,
        customerName: `${customer.firstName} ${customer.lastName}`,
        itemCount: String(items.length),
      },
    });

    // Create order in database (pending status)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        stripePaymentIntentId: paymentIntentId,
        customerEmail: customer.email,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerPhone: customer.phone,
        subtotal,
        gstAmount,
        total,
        shippingAddress: {}, // Digital products - no physical shipping
        orderItems: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            gstRate: item.gstRate,
            total: item.total,
            productName: item.productName,
            productSku: item.productSku,
            productImage: item.productImage,
          })),
        },
      },
    });

    return NextResponse.json({
      clientSecret,
      orderNumber,
      orderId: order.id,
      amount: total,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    return NextResponse.json(
      { error: 'Failed to process checkout. Please try again.' },
      { status: 500 }
    );
  }
}
