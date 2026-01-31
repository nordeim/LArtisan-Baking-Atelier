'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-crust-900 text-white">
        <span className="font-display text-lg font-semibold">Admin</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-crust-800"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-crust-900 text-crust-100 flex flex-col",
        "transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-crust-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crust-400 rounded-xl flex items-center justify-center">
              <span className="text-crust-950 font-bold text-lg">L</span>
            </div>
            <div>
              <span className="font-display font-semibold text-crust-50 block leading-tight">
                L&apos;Artisan
              </span>
              <span className="text-xs text-crust-400">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      isActive 
                        ? "bg-crust-400 text-crust-950 font-medium" 
                        : "text-crust-300 hover:bg-crust-800 hover:text-crust-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-crust-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-crust-300 hover:bg-crust-800 hover:text-crust-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
