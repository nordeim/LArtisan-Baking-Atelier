import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyToken } from '@/lib/auth';
import { Package, BookOpen, User, LogOut } from 'lucide-react';

/**
 * Account Layout - Protected Customer Portal
 * 
 * Wraps all account pages with:
 * - JWT authentication check
 * - Sidebar navigation
 * - Role-based access (CUSTOMER only)
 */

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('__Host-artisan-token')?.value;

  if (!token) {
    redirect('/login?redirect=/account');
  }

  const payload = await verifyToken(token);

  if (!payload || payload.role !== 'CUSTOMER') {
    redirect('/login?redirect=/account');
  }

  const navItems = [
    { href: '/account/orders', label: 'My Orders', icon: Package },
    { href: '/account/courses', label: 'My Courses', icon: BookOpen },
    { href: '/account/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-flour-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-bread-200 shadow-soft overflow-hidden">
              <div className="p-6 border-b border-bread-200">
                <h2 className="font-serif text-xl font-semibold text-cocoa-900">
                  My Account
                </h2>
                <p className="text-sm text-cocoa-600 mt-1">
                  {payload.email}
                </p>
              </div>
              
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-cocoa-700 hover:bg-flour-100 hover:text-cocoa-900 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                <div className="border-t border-bread-200 my-2" />
                
                <Link
                  href="/api/auth/logout"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-cocoa-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
