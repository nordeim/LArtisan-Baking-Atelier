import { prisma } from '@/lib/prisma';
import { StatsCards } from '@/components/admin/StatsCards';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';

/**
 * Admin Dashboard
 * 
 * Overview page with stats, recent orders, and quick actions.
 */

async function getDashboardStats() {
  // Get counts
  const [
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCustomers,
    recentOrders,
    lowStockProducts,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: { select: { id: true } },
      },
    }),
    prisma.$queryRaw<{ id: string; name: string; stockQuantity: number }[]>`
      SELECT id, name, stock_quantity as "stockQuantity"
      FROM products
      WHERE is_available = true AND stock_quantity <= low_stock_threshold
      LIMIT 5
    `,
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ]);

  // Calculate revenue in cents
  const revenueCents = Number(totalRevenue._sum.total?.toString() || '0') * 100;

  return {
    totalOrders,
    totalRevenue: revenueCents,
    totalProducts,
    totalCustomers,
    recentOrders,
    lowStockProducts,
    ordersByStatus,
    // Mock period change (would calculate from real data in production)
    periodChange: {
      orders: 12,
      revenue: 8,
    },
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-crust-900">
          Dashboard
        </h1>
        <p className="text-crust-600 mt-1">
          Overview of your atelier&apos;s performance
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-crust-100">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-crust-900">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm font-medium text-crust-700 hover:text-crust-900"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.recentOrders.length === 0 ? (
              <p className="text-crust-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-crust-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-crust-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-crust-600">
                        {order.user?.name || order.user?.email || 'Guest'}
                      </p>
                      <p className="text-xs text-crust-500 mt-1">
                        {order.orderItems.length} items • {new Date(order.createdAt).toLocaleDateString('en-SG')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-crust-900">
                        S${Number(order.total).toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-display text-lg font-semibold text-crust-900 mb-4">
              Order Status
            </h2>
            <div className="space-y-3">
              {stats.ordersByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-crust-600">{item.status}</span>
                  <span className="font-medium text-crust-900">{item._count.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-crust-900">
                Low Stock Alerts
              </h2>
              <Link
                href="/admin/products"
                className="text-sm font-medium text-crust-700 hover:text-crust-900"
              >
                Manage →
              </Link>
            </div>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-crust-500 text-sm">All products well stocked</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-crust-900 truncate">
                      {product.name}
                    </span>
                    <span className="text-sm text-red-600 font-medium">
                      {product.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-display text-lg font-semibold text-crust-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/admin/products/new"
                className="block w-full text-center py-3 bg-crust-900 text-crust-50 rounded-xl font-medium hover:bg-crust-800 transition-colors"
              >
                + Add New Product
              </Link>
              <Link
                href="/admin/orders"
                className="block w-full text-center py-3 bg-crust-100 text-crust-900 rounded-xl font-medium hover:bg-crust-200 transition-colors"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
