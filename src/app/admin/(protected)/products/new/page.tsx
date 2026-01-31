import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import Link from 'next/link';

/**
 * New Product Page
 * 
 * Form for creating a new product.
 */

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories;
}

export const metadata = {
  title: 'New Product | Admin | L\'Artisan Baking Atelier',
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/admin/products" className="text-crust-600 hover:text-crust-900">
          ← Back to Products
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-crust-900">
          New Product
        </h1>
        <p className="text-crust-600 mt-1">
          Add a new product to your catalog
        </p>
      </div>

      {/* Form */}
      <ProductForm categories={categories} />
    </div>
  );
}
