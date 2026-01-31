import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/admin/DataTable';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';

/**
 * Admin Orders Page
 * 
 * List view of all orders with filtering, sorting, and pagination.
 */

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: { select: { id: true } },
    },
  });

  return orders;
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

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

  const columns: ColumnDef<typeof orders[0]>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Order',
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="font-medium text-crust-900 hover:text-crust-700"
        >
          {row.getValue('orderNumber')}
        </Link>
      ),
    },
    {
      accessorKey: 'user.name',
      header: 'Customer',
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div>
            <p className="font-medium text-crust-900">{user?.name || 'Guest'}</p>
            <p className="text-sm text-crust-500">{user?.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString('en-SG'),
    },
    {
      accessorKey: 'orderItems',
      header: 'Items',
      cell: ({ row }) => `${row.original.orderItems.length} items`,
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => `S${Number(row.getValue('total')).toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as OrderStatus;
        return (
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as string;
        const color = status === 'PAID' ? 'text-green-600' : status === 'PENDING' ? 'text-yellow-600' : 'text-red-600';
        return <span className={`font-medium ${color}`}>{status}</span>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="text-sm font-medium text-crust-700 hover:text-crust-900"
        >
          View →
        </Link>
      ),
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-crust-900">
          Orders
        </h1>
        <p className="text-crust-600 mt-1">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Pending', value: orders.filter((o) => o.status === 'PENDING').length },
          { label: 'Processing', value: orders.filter((o) => ['CONFIRMED', 'PREPARING'].includes(o.status)).length },
          { label: 'Completed', value: orders.filter((o) => o.status === 'DELIVERED').length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-crust-600">{stat.label}</p>
            <p className="font-display text-2xl font-semibold text-crust-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <DataTable columns={columns} data={orders} pageSize={10} />
      </div>
    </div>
  );
}
