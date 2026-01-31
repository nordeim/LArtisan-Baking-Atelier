import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { OrderStatus } from '@prisma/client';
import { UpdateOrderForm } from '@/components/admin/UpdateOrderForm';

/**
 * Admin Order Detail Page
 * 
 * Detailed view of a single order with customer info, items, and status management.
 */

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

interface OrderItemWithProduct {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    sku: string;
    images: string[];
  };
}

interface OrderWithItems {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  total: number;
  subtotal: number;
  gstAmount: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  } | null;
  stripePaymentIntentId: string | null;
  trackingNumber: string | null;
  customerEmail: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  } | null;
  orderItems: OrderItemWithProduct[];
}

async function getOrder(id: string): Promise<OrderWithItems | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: {
        include: {
          product: { select: { name: true, sku: true, images: true } },
        },
      },
    },
  });

  return order as OrderWithItems | null;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-purple-100 text-purple-800',
      READY: 'bg-indigo-100 text-indigo-800',
      SHIPPED: 'bg-cyan-100 text-cyan-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const orderStatuses: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/admin/orders" className="text-crust-600 hover:text-crust-900">
          ← Back to Orders
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-crust-900">
            {order.orderNumber}
          </h1>
          <p className="text-crust-600 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString('en-SG')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-display text-xl font-semibold text-crust-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-crust-50 rounded-xl"
                >
                  <div className="w-16 h-16 bg-crust-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-crust-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-crust-900">{item.product.name}</p>
                    <p className="text-sm text-crust-500">SKU: {item.product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-crust-900">
                      S${Number(item.price).toFixed(2)}
                    </p>
                    <p className="text-sm text-crust-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-crust-900">
                      S${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-crust-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-crust-600">
                  <span>Subtotal</span>
                  <span>S${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-crust-600">
                  <span>GST (9%)</span>
                  <span>S${Number(order.gstAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-display text-lg font-semibold text-crust-900 pt-2 border-t border-crust-200">
                  <span>Total</span>
                  <span>S${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-display text-xl font-semibold text-crust-900 mb-4">
              Payment Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-crust-500">Payment Method</p>
                <p className="font-medium text-crust-900">Credit Card (Stripe)</p>
              </div>
              <div>
                <p className="text-crust-500">Payment Status</p>
                <p className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-crust-500">Stripe Payment ID</p>
                <p className="font-medium text-crust-900 font-mono text-xs">
                  {order.stripePaymentIntentId || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-display text-lg font-semibold text-crust-900 mb-4">
              Customer
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-crust-500">Name</p>
                <p className="font-medium text-crust-900">{order.user?.name || 'Guest'}</p>
              </div>
              <div>
                <p className="text-crust-500">Email</p>
                <p className="font-medium text-crust-900">{order.user?.email || order.customerEmail}</p>
              </div>

            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-display text-lg font-semibold text-crust-900 mb-4">
                Shipping Address
              </h2>
              <address className="not-italic text-sm text-crust-700 space-y-1">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
          )}

          {/* Update Order Status */}
          <UpdateOrderForm
            orderId={order.id}
            currentStatus={order.status}
            statuses={orderStatuses}
            trackingNumber={order.trackingNumber || ''}
          />
        </div>
      </div>
    </div>
  );
}
