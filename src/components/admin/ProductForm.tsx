'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Category } from '@prisma/client';

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    compareAtPrice: number | null;
    gstRate: number;
    sku: string;
    stockQuantity: number;
    lowStockThreshold: number;
    categoryId: string | null;
    images: string[];
    weight: number | null;
    isDigital: boolean;
    isAvailable: boolean;
    isFeatured: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || '',
    price: initialData?.price ? (initialData.price / 100).toFixed(2) : '',
    compareAtPrice: initialData?.compareAtPrice ? (initialData.compareAtPrice / 100).toFixed(2) : '',
    gstRate: initialData?.gstRate ? (initialData.gstRate * 100).toString() : '9',
    sku: initialData?.sku || '',
    stockQuantity: initialData?.stockQuantity.toString() || '0',
    lowStockThreshold: initialData?.lowStockThreshold.toString() || '5',
    categoryId: initialData?.categoryId || '',
    images: initialData?.images || [],
    weight: initialData?.weight?.toString() || '',
    isDigital: initialData?.isDigital || false,
    isAvailable: initialData?.isAvailable ?? true,
    isFeatured: initialData?.isFeatured || false,
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100),
        compareAtPrice: formData.compareAtPrice ? Math.round(parseFloat(formData.compareAtPrice) * 100) : null,
        gstRate: parseFloat(formData.gstRate) / 100,
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      const url = isEditing ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      await response.json();
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
    if (newImageUrl && !formData.images.includes(newImageUrl)) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-xl">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-display text-xl font-semibold text-crust-900">Basic Information</h2>

          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="mt-2"
              />
              <Button type="button" variant="outline" onClick={generateSlug} className="mt-2">
                Generate
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Full Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-crust-200 focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none resize-none"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-crust-200 bg-white focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-display text-xl font-semibold text-crust-900">Pricing</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (SGD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="compareAtPrice">Compare at Price</Label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="gstRate">GST Rate (%)</Label>
            <Input
              id="gstRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.gstRate}
              onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="font-display text-xl font-semibold text-crust-900 mb-4">Images</h2>
        <div className="flex gap-2 mb-4">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Button type="button" onClick={addImage}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {formData.images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-crust-100">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="font-display text-xl font-semibold text-crust-900 mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isAvailable: checked as boolean })
              }
            />
            <Label htmlFor="isAvailable">Available for purchase</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isFeatured: checked as boolean })
              }
            />
            <Label htmlFor="isFeatured">Featured product</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="isDigital"
              checked={formData.isDigital}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isDigital: checked as boolean })
              }
            />
            <Label htmlFor="isDigital">Digital product (no shipping)</Label>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="font-display text-xl font-semibold text-crust-900">SEO</h2>
        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            rows={3}
            className="w-full mt-2 px-4 py-3 rounded-xl border border-crust-200 focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="px-8">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            isEditing ? 'Update Product' : 'Create Product'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
