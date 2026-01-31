/**
 * Client-side Authentication Helpers
 * 
 * These functions can be safely called from Client Components
 * to check authentication status and get current user info.
 */

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Get current user from JWT token
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    const response = await fetch('/api/account/profile', {
      method: 'GET',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}
