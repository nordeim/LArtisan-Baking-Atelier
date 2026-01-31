import { NextResponse } from 'next/server';

/**
 * Admin Logout API
 * 
 * Clears the authentication cookie.
 */

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the auth cookie
  response.cookies.set({
    name: '__Host-artisan-token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
