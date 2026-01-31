/**
 * Admin Login Layout
 * 
 * Public layout for the login page - no authentication required.
 * This prevents the redirect loop that would occur if login used the protected layout.
 */

export const metadata = {
  title: 'Admin Login | L\'Artisan Baking Atelier',
  description: 'Admin login portal.',
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
