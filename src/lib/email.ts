// ============================================
// L'Artisan Baking Atelier - Email Service
// Resend integration for transactional emails
// ============================================

import { Resend } from 'resend';

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Default from address
const DEFAULT_FROM = process.env.EMAIL_FROM || 'L\'Artisan Baking Atelier <noreply@artisan-baking.com>';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  data?: { id: string };
  error?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  // Check if Resend is configured
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: options.from || DEFAULT_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    });

    if (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('Email sent successfully:', data?.id);
    return {
      success: true,
      data: data || undefined,
    };
  } catch (error) {
    console.error('Email send exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  to: string,
  orderDetails: {
    orderNumber: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    gstAmount: number;
    total: number;
    customerName: string;
  }
): Promise<EmailResult> {
  const { orderNumber, items, subtotal, gstAmount, total, customerName } = orderDetails;

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${((item.price * item.quantity) / 100).toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'DM Sans', Arial, sans-serif; line-height: 1.6; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #fdf8f3; padding: 40px; border-radius: 16px;">
        <header style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #4a3728; margin: 0;">L'Artisan Baking Atelier</h1>
          <p style="color: #8b7355; margin-top: 8px;">Order Confirmation</p>
        </header>
        
        <main>
          <p style="font-size: 18px; margin-bottom: 24px;">Dear ${customerName},</p>
          
          <p>Thank you for your order! We're excited to help you on your baking journey.</p>
          
          <div style="background: white; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #4a3728; margin-top: 0;">Order Details</h2>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background: #f5f0eb;">
                  <th style="padding: 12px; text-align: left;">Item</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 24px; padding-top: 24px; border-top: 2px solid #eee;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Subtotal:</span>
                <span>$${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>GST (9%):</span>
                <span>$${(gstAmount / 100).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee;">
                <span>Total:</span>
                <span>$${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 12px; margin: 24px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">🎓 Access Your Courses</h3>
            <p style="margin-bottom: 0;">You can access your courses immediately by visiting your account dashboard:</p>
            <p style="margin-top: 8px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/courses" style="color: #4a3728; text-decoration: underline;">My Courses</a>
            </p>
          </div>
          
          <p style="margin-top: 32px;">If you have any questions about your order, please don't hesitate to contact us at <a href="mailto:support@artisan-baking.com" style="color: #4a3728;">support@artisan-baking.com</a>.</p>
          
          <p>Happy baking!<br>The L'Artisan Baking Atelier Team</p>
        </main>
        
        <footer style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #ddd; text-align: center; color: #8b7355; font-size: 14px;">
          <p>L'Artisan Baking Atelier | Singapore</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #4a3728;">Website</a> |
            <a href="mailto:support@artisan-baking.com" style="color: #4a3728;">Support</a>
          </p>
        </footer>
      </div>
    </body>
    </html>
  `;

  const text = `
Order Confirmation - L'Artisan Baking Atelier

Dear ${customerName},

Thank you for your order! We're excited to help you on your baking journey.

Order Number: ${orderNumber}

Order Summary:
${items.map(item => `- ${item.name} x${item.quantity}: $${((item.price * item.quantity) / 100).toFixed(2)}`).join('\n')}

Subtotal: $${(subtotal / 100).toFixed(2)}
GST (9%): $${(gstAmount / 100).toFixed(2)}
Total: $${(total / 100).toFixed(2)}

Access Your Courses:
Visit ${process.env.NEXT_PUBLIC_APP_URL}/account/courses to start learning.

If you have any questions, contact us at support@artisan-baking.com.

Happy baking!
The L'Artisan Baking Atelier Team
  `;

  return sendEmail({
    to,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
    text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetData: {
    resetToken: string;
    userName: string;
    expiresIn: string;
  }
): Promise<EmailResult> {
  const { resetToken, userName, expiresIn } = resetData;
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: 'DM Sans', Arial, sans-serif; line-height: 1.6; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #fdf8f3; padding: 40px; border-radius: 16px;">
        <header style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #4a3728; margin: 0;">L'Artisan Baking Atelier</h1>
          <p style="color: #8b7355; margin-top: 8px;">Password Reset Request</p>
        </header>
        
        <main>
          <p style="font-size: 18px;">Hello ${userName},</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #d4a574; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          
          <p style="color: #8b7355; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 14px;">${resetUrl}</p>
          
          <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin: 24px 0;">
            <p style="margin: 0; color: #e65100;"><strong>⏰ This link expires in ${expiresIn}</strong></p>
          </div>
          
          <p style="margin-top: 32px;">If you didn't request a password reset, please ignore this email or contact us if you have concerns.</p>
          
          <p>For security reasons, this link can only be used once.</p>
        </main>
        
        <footer style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #ddd; text-align: center; color: #8b7355; font-size: 14px;">
          <p>L'Artisan Baking Atelier | Singapore</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #4a3728;">Website</a> |
            <a href="mailto:support@artisan-baking.com" style="color: #4a3728;">Support</a>
          </p>
        </footer>
      </div>
    </body>
    </html>
  `;

  const text = `
Password Reset - L'Artisan Baking Atelier

Hello ${userName},

We received a request to reset your password. Visit the link below to create a new password:

${resetUrl}

This link expires in ${expiresIn}.

If you didn't request a password reset, please ignore this email or contact us at support@artisan-baking.com.

For security reasons, this link can only be used once.

L'Artisan Baking Atelier | Singapore
  `;

  return sendEmail({
    to,
    subject: 'Password Reset Request',
    html,
    text,
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  to: string,
  userData: {
    userName: string;
  }
): Promise<EmailResult> {
  const { userName } = userData;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to L'Artisan Baking Atelier</title>
    </head>
    <body style="font-family: 'DM Sans', Arial, sans-serif; line-height: 1.6; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #fdf8f3; padding: 40px; border-radius: 16px;">
        <header style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #4a3728; margin: 0;">L'Artisan Baking Atelier</h1>
          <p style="color: #8b7355; margin-top: 8px;">Welcome to Our Community</p>
        </header>
        
        <main>
          <p style="font-size: 18px;">Welcome, ${userName}! 🥐</p>
          
          <p>We're thrilled to have you join our community of passionate bakers. Whether you're just starting out or looking to refine your skills, we're here to help you create delicious memories.</p>
          
          <div style="background: white; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #4a3728; margin-top: 0;">Get Started</h2>
            <ul style="padding-left: 20px;">
              <li style="margin-bottom: 12px;">Browse our <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="color: #d4a574;">course catalog</a> and find your perfect match</li>
              <li style="margin-bottom: 12px;">Visit your <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" style="color: #d4a574;">account dashboard</a> to manage your profile</li>
              <li style="margin-bottom: 12px;">Download our <a href="#" style="color: #d4a574;">free sourdough starter guide</a></li>
              <li>Join our community forum to connect with fellow bakers</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="display: inline-block; background: #d4a574; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore Courses</a>
          </div>
          
          <p>If you have any questions, our support team is always here to help at <a href="mailto:support@artisan-baking.com" style="color: #4a3728;">support@artisan-baking.com</a>.</p>
          
          <p>Happy baking!<br>The L'Artisan Baking Atelier Team</p>
        </main>
        
        <footer style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #ddd; text-align: center; color: #8b7355; font-size: 14px;">
          <p>L'Artisan Baking Atelier | Singapore</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #4a3728;">Website</a> |
            <a href="mailto:support@artisan-baking.com" style="color: #4a3728;">Support</a>
          </p>
        </footer>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to L'Artisan Baking Atelier

Welcome, ${userName}!

We're thrilled to have you join our community of passionate bakers. Whether you're just starting out or looking to refine your skills, we're here to help you create delicious memories.

Get Started:
- Browse our course catalog: ${process.env.NEXT_PUBLIC_APP_URL}/shop
- Visit your account dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/account
- Download our free sourdough starter guide

If you have any questions, contact us at support@artisan-baking.com.

Happy baking!
The L'Artisan Baking Atelier Team
  `;

  return sendEmail({
    to,
    subject: 'Welcome to L\'Artisan Baking Atelier!',
    html,
    text,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdate(
  to: string,
  updateData: {
    orderNumber: string;
    status: string;
    customerName: string;
    message?: string;
  }
): Promise<EmailResult> {
  const { orderNumber, status, customerName, message } = updateData;

  const statusMessages: Record<string, { title: string; emoji: string; description: string }> = {
    CONFIRMED: {
      title: 'Order Confirmed',
      emoji: '✅',
      description: 'Your order has been confirmed and is being prepared.',
    },
    SHIPPED: {
      title: 'Order Shipped',
      emoji: '🚚',
      description: 'Your order has been shipped and is on its way!',
    },
    DELIVERED: {
      title: 'Order Delivered',
      emoji: '📦',
      description: 'Your order has been delivered. Enjoy your baking journey!',
    },
  };

  const statusInfo = statusMessages[status] || {
    title: 'Order Update',
    emoji: '📋',
    description: `Your order status has been updated to: ${status}`,
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusInfo.title}</title>
    </head>
    <body style="font-family: 'DM Sans', Arial, sans-serif; line-height: 1.6; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #fdf8f3; padding: 40px; border-radius: 16px;">
        <header style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #4a3728; margin: 0;">L'Artisan Baking Atelier</h1>
          <p style="color: #8b7355; margin-top: 8px;">${statusInfo.title}</p>
        </header>
        
        <main>
          <p style="font-size: 18px;">Hello ${customerName},</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <div style="font-size: 64px; margin-bottom: 16px;">${statusInfo.emoji}</div>
            <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #4a3728; margin: 0;">${statusInfo.title}</h2>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <p style="margin: 0;"><strong>Order Number:</strong> ${orderNumber}</p>
            <p style="margin-top: 16px;">${statusInfo.description}</p>
            ${message ? `<p style="margin-top: 16px; color: #8b7355;">${message}</p>` : ''}
          </div>
          
          <p>You can view your order details at any time by visiting your <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" style="color: #4a3728;">order history</a>.</p>
          
          <p>Questions? Contact us at <a href="mailto:support@artisan-baking.com" style="color: #4a3728;">support@artisan-baking.com</a>.</p>
        </main>
        
        <footer style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #ddd; text-align: center; color: #8b7355; font-size: 14px;">
          <p>L'Artisan Baking Atelier | Singapore</p>
        </footer>
      </div>
    </body>
    </html>
  `;

  const text = `
${statusInfo.title} - L'Artisan Baking Atelier

Hello ${customerName},

${statusInfo.emoji} ${statusInfo.title}

Order Number: ${orderNumber}

${statusInfo.description}
${message ? '\n' + message : ''}

View your order: ${process.env.NEXT_PUBLIC_APP_URL}/account/orders

Questions? Contact us at support@artisan-baking.com.
  `;

  return sendEmail({
    to,
    subject: `${statusInfo.title} - Order ${orderNumber}`,
    html,
    text,
  });
}
