'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  gstAmount: number;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
  digitalAccess: {
    id: string;
    product: {
      id: string;
      name: string;
    };
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/account/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-caramel-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-bread-200 p-6 shadow-soft">
        <h1 className="text-2xl font-serif font-semibold text-cocoa-900">
          My Orders
        </h1>
        <p className="text-cocoa-600 mt-1">
          View and track your order history
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-bread-200 p-12 shadow-soft text-center">
          <div className="w-16 h-16 rounded-full bg-bread-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-cocoa-400" />
          </div>
          <h2 className="text-lg font-medium text-cocoa-900 mb-2">
            No orders yet
          </h2>
          <p className="text-cocoa-600 mb-6">
            You haven&apos;t placed any orders yet. Start exploring our artisan products!
          </p>
          <Link href="/shop">
            <Button>Browse Shop</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-bread-200 shadow-soft overflow-hidden">
          <div className="divide-y divide-bread-200">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 hover:bg-flour-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-caramel-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-caramel-600" />
                    </div>
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
                        {' · '}
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="font-semibold text-cocoa-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-bread-200 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-cocoa-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Order #{selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="flex items-center justify-between py-4 border-b border-bread-200">
                <div>
                  <p className="text-sm text-cocoa-600">Order Date</p>
                  <p className="font-medium text-cocoa-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-SG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium text-cocoa-900 mb-4">Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-flour-50 rounded-xl"
                    >
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-cocoa-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-cocoa-600">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-cocoa-900">
                        ${item.total.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Access */}
              {selectedOrder.digitalAccess.length > 0 && (
                <div>
                  <h3 className="font-medium text-cocoa-900 mb-4">Digital Access</h3>
                  <div className="space-y-2">
                    {selectedOrder.digitalAccess.map((access) => (
                      <div
                        key={access.id}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-xl text-green-800"
                      >
                        <span className="text-sm">✓</span>
                        <span className="text-sm font-medium">
                          {access.product.name} — Access granted
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="border-t border-bread-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cocoa-600">Subtotal</span>
                  <span className="text-cocoa-900">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cocoa-600">GST (9%)</span>
                  <span className="text-cocoa-900">${selectedOrder.gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-bread-200">
                  <span className="text-cocoa-900">Total</span>
                  <span className="text-cocoa-900">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
