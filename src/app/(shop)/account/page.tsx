import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import { Package, BookOpen, ChevronRight } from 'lucide-react';
import type { OrderStatus } from '@prisma/client';

/**
 * Account Dashboard
 * 
 * Shows overview of user's account activity:
 * - Recent orders
 * - Course access count
 * - Quick navigation
 */

function getStatusStyles(status: OrderStatus) {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CONFIRMED':
    case 'PREPARING':
    case 'READY':
    case 'SHIPPED':
      return 'bg-caramel-100 text-caramel-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('__Host-artisan-token')?.value;

  if (!token) {
    redirect('/login?redirect=/account');
  }

  const payload = await verifyToken(token);

  if (!payload || payload.role !== 'CUSTOMER') {
    redirect('/login?redirect=/account');
  }

  // Fetch recent orders
  const recentOrders = await prisma.order.findMany({
    where: {
      userId: payload.sub,
      status: { not: 'PENDING' },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  // Fetch course count
  const courseCount = await prisma.digitalAccess.count({
    where: {
      userId: payload.sub,
      revokedAt: null,
    },
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl border border-bread-200 p-8 shadow-soft">
        <h1 className="text-2xl font-serif font-semibold text-cocoa-900">
          Welcome back, {payload.name?.split(' ')[0]}!
        </h1>
        <p className="text-cocoa-600 mt-2">
          Manage your orders, courses, and account settings from your personal dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="group bg-white rounded-2xl border border-bread-200 p-6 shadow-soft hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-caramel-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-caramel-600" />
              </div>
              <div>
                <p className="text-sm text-cocoa-600">Total Orders</p>
                <p className="text-2xl font-semibold text-cocoa-900">
                  {recentOrders.length > 0 ? `${recentOrders.length}+` : '0'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-cocoa-400 group-hover:text-cocoa-600 transition-colors" />
          </div>
        </Link>

        <Link
          href="/account/courses"
          className="group bg-white rounded-2xl border border-bread-200 p-6 shadow-soft hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-espresso-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-espresso-600" />
              </div>
              <div>
                <p className="text-sm text-cocoa-600">My Courses</p>
                <p className="text-2xl font-semibold text-cocoa-900">
                  {courseCount}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-cocoa-400 group-hover:text-cocoa-600 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-bread-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-bread-200 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-cocoa-900">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-espresso-600 hover:text-espresso-800 font-medium"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-cocoa-600">No orders yet</p>
            <Link
              href="/shop"
              className="text-espresso-600 hover:text-espresso-800 font-medium mt-2 inline-block"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-bread-200">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-cocoa-900">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-sm text-cocoa-600">
                    {new Date(order.createdAt).toLocaleDateString('en-SG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-sm font-medium text-cocoa-900 mt-1">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
