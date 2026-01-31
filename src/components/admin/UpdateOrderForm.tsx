'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrderStatus } from '@prisma/client';

interface UpdateOrderFormProps {
  orderId: string;
  currentStatus: OrderStatus;
  statuses: OrderStatus[];
  trackingNumber: string;
}

export function UpdateOrderForm({
  orderId,
  currentStatus,
  statuses,
  trackingNumber: initialTracking,
}: UpdateOrderFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      setMessage('Order updated successfully');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-display text-lg font-semibold text-crust-900 mb-4">
        Update Order
      </h2>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm mb-4 ${
            message.includes('success')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="status">Order Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full mt-2 px-4 py-2 rounded-xl border border-crust-200 bg-white focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="tracking">Tracking Number</Label>
          <Input
            id="tracking"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. SGP123456789"
            className="mt-2"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Order'
          )}
        </Button>
      </div>
    </form>
  );
}
