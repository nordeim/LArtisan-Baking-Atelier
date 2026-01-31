'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, description, trend, trendValue, icon }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-crust-500';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-crust-600">{title}</p>
          <p className="font-display text-3xl font-semibold text-crust-900 mt-2">{value}</p>
          {description && (
            <p className="text-sm text-crust-500 mt-1">{description}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-crust-100 rounded-xl flex items-center justify-center text-crust-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    periodChange: {
      orders: number;
      revenue: number;
    };
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const formatTrend = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}% from last month`;
  };

  const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Orders"
        value={stats.totalOrders.toLocaleString()}
        description="All time orders"
        trend={getTrend(stats.periodChange.orders)}
        trendValue={formatTrend(stats.periodChange.orders)}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
      />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        description="All time revenue"
        trend={getTrend(stats.periodChange.revenue)}
        trendValue={formatTrend(stats.periodChange.revenue)}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        title="Products"
        value={stats.totalProducts.toString()}
        description="Active products"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
      <StatCard
        title="Customers"
        value={stats.totalCustomers.toLocaleString()}
        description="Registered customers"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
    </div>
  );
}
