import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * Edit Product Page
 * 
 * Form for editing an existing product.
 */

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories;
}

export const metadata = {
  title: 'Edit Product | Admin | L\'Artisan Baking Atelier',
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

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
          Edit Product
        </h1>
        <p className="text-crust-600 mt-1">
          Update product details
        </p>
      </div>

      {/* Form */}
      <ProductForm
        categories={categories}
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          gstRate: Number(product.gstRate),
          sku: product.sku,
          stockQuantity: product.stockQuantity,
          lowStockThreshold: product.lowStockThreshold,
          categoryId: product.categoryId,
          images: product.images,
          weight: product.weight ? Number(product.weight) : null,
          isDigital: product.isDigital,
          isAvailable: product.isAvailable,
          isFeatured: product.isFeatured,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
        }}
      />
    </div>
  );
}
