import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * Admin Layout
 * 
 * Protected layout for admin pages. Validates JWT token and ADMIN role.
 * Redirects to login if unauthorized.
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
  // Verify authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('__Host-artisan-token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const payload = await verifyToken(token);

  if (!payload || payload.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-crust-50 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
