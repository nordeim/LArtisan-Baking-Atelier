/**
 * Admin Root Layout
 * 
 * Simple pass-through layout. The actual protection is handled by:
 * - protected/layout.tsx - for protected routes (requires auth)
 * - public/login/layout.tsx - for login (no auth required)
 */

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
