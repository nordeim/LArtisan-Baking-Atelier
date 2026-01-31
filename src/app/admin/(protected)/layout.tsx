import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * Admin Layout
 * 
 * Protected layout for admin pages. Validates JWT token and ADMIN role.
 * Redirects to login if unauthorized.
 * 
 * Note: Login page is exempt from auth check to prevent redirect loops.
 */

export const metadata = {
  title: 'Admin | L\'Artisan Baking Atelier',
  description: 'Admin dashboard for managing orders and products.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current pathname from headers
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-matched-path') || '';
  
  // Check if we're on the login page - skip auth check to prevent loop
  const isLoginPage = pathname === '/admin/login' || pathname.endsWith('/admin/login');
  
  // Verify authentication (skip for login page)
  if (!isLoginPage) {
    const cookieStore = await cookies();
    const token = cookieStore.get('__Host-artisan-token')?.value;

    if (!token) {
      redirect('/admin/login');
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== 'ADMIN') {
      redirect('/admin/login');
    }
  }

  return (
    <div className="min-h-screen bg-crust-50 flex">
      {!isLoginPage && <AdminSidebar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
