import Link from 'next/link';
import { adminNavItems } from '@/lib/navigation';

/**
 * Admin Layout
 * 
 * Simplified layout for admin dashboard with sidebar navigation.
 * No footer - admin pages are tools.
 */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-crust-100">
      {/* Admin Header */}
      <header className="bg-crust-900 text-crust-100 border-b border-crust-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-crust-800 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-crust-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <span className="font-display text-lg font-semibold">
                  L&apos;Artisan
                </span>
                <span className="ml-2 text-xs text-crust-500 uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </Link>

            {/* Back to Store */}
            <Link
              href="/"
              className="text-sm text-crust-400 hover:text-crust-100 transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-card p-4">
              <ul className="space-y-1">
                {adminNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-crust-700 hover:text-crust-900 hover:bg-crust-100 rounded-xl transition-colors"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-card p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
