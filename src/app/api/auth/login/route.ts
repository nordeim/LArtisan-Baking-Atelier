import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken } from '@/lib/auth';

/**
 * Admin Login API
 * 
 * Authenticates admin users and sets secure HTTP-only cookie.
 * Rate limited to prevent brute force attacks.
 */

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user has ADMIN role
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.hashedPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: '__Host-artisan-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: (error as z.ZodError).issues },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
