import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/admin/DataTable';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';

/**
 * Admin Products Page
 * 
 * List view of all products with filtering, sorting, and quick actions.
 */

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      _count: { select: { orderItems: true } },
    },
  });

  return products;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= threshold) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const columns: ColumnDef<typeof products[0]>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-crust-100 rounded-lg overflow-hidden flex-shrink-0">
            {row.original.images?.[0] ? (
              <img
                src={row.original.images[0]}
                alt={row.original.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-crust-400">
                No img
              </div>
            )}
          </div>
          <div>
            <Link
              href={`/admin/products/${row.original.id}`}
              className="font-medium text-crust-900 hover:text-crust-700"
            >
              {row.getValue('name')}
            </Link>
            <p className="text-xs text-crust-500">{row.original.sku}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category.name',
      header: 'Category',
      cell: ({ row }) => row.original.category?.name || '—',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => `S${Number(row.getValue('price')).toFixed(2)}`,
    },
    {
      accessorKey: 'stockQuantity',
      header: 'Stock',
      cell: ({ row }) => {
        const status = getStockStatus(
          row.original.stockQuantity,
          row.original.lowStockThreshold
        );
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.stockQuantity}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'isAvailable',
      header: 'Status',
      cell: ({ row }) => {
        const isAvailable = row.getValue('isAvailable') as boolean;
        return (
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              isAvailable
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isAvailable ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      accessorKey: 'isFeatured',
      header: 'Featured',
      cell: ({ row }) =>
        row.getValue('isFeatured') ? (
          <span className="text-crust-400">★</span>
        ) : (
          '—'
        ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link
          href={`/admin/products/${row.original.id}`}
          className="text-sm font-medium text-crust-700 hover:text-crust-900"
        >
          Edit →
        </Link>
      ),
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-crust-900">
            Products
          </h1>
          <p className="text-crust-600 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-crust-900 text-crust-50 font-semibold rounded-xl hover:bg-crust-800 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length },
          { label: 'Active', value: products.filter((p) => p.isAvailable).length },
          { label: 'Featured', value: products.filter((p) => p.isFeatured).length },
          { label: 'Low Stock', value: products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-crust-600">{stat.label}</p>
            <p className="font-display text-2xl font-semibold text-crust-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <DataTable columns={columns} data={products} pageSize={10} />
      </div>
    </div>
  );
}
