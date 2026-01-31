/**
 * Authentication Module
 * 
 * JWT token management with Jose library for edge runtime compatibility.
 * Secure cookie handling with httpOnly, secure, and sameSite flags.
 * 
 * Security Features:
 * - Bcrypt password hashing (12 rounds)
 * - HS256 JWT signing
 * - __Host- prefix cookie name
 * - 8-hour token expiration
 * - httpOnly, secure, sameSite=strict cookies
 */

import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';

// ============================================
// Configuration
// ============================================

/** JWT Secret from environment */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production'
);

/** JWT expiration time (8 hours) */
const JWT_EXPIRATION = '8h';

/** Cookie name with __Host- prefix for additional security */
const AUTH_COOKIE_NAME = '__Host-artisan-token';

/** Cookie max age in seconds (8 hours) */
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

// ============================================
// Types
// ============================================

/**
 * JWT Payload structure
 * 
 * Note: 'iat' (issued at) and 'exp' (expiration) are automatically
 * added by the JWT library and should not be manually set.
 */
export interface JWTPayload {
  /** User ID (subject) */
  sub: string;
  /** User email */
  email: string;
  /** User name (optional) */
  name?: string;
  /** User role */
  role: UserRole;
  /** Issued at timestamp */
  iat: number;
  /** Expiration timestamp */
  exp: number;
}

/**
 * Token payload for creating new tokens
 * (excludes auto-generated fields)
 */
export interface TokenPayload {
  sub: string;
  email: string;
  name?: string;
  role: UserRole;
}

// ============================================
// Password Management
// ============================================

/**
 * Hash a password using bcrypt
 * 
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against a hash
 * 
 * @param password - Plain text password
 * @param hashed - Hashed password from database
 * @returns True if password matches
 */
export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// ============================================
// JWT Token Management
// ============================================

/**
 * Create a new JWT token
 * 
 * @param payload - Token payload (user data)
 * @returns Signed JWT string
 */
export async function createToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT({
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 * 
 * @param token - JWT string
 * @returns Decoded payload or null if invalid
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    return payload as unknown as JWTPayload;
  } catch {
    // Token is invalid or expired
    return null;
  }
}

// ============================================
// Cookie Management
// ============================================

/**
 * Set the authentication cookie
 * 
 * @param token - JWT token string
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Remove the authentication cookie (logout)
 */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete({
    name: AUTH_COOKIE_NAME,
    path: '/',
  });
}

/**
 * Get the authentication token from cookies
 * 
 * @returns Token string or undefined
 */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE_NAME);
  return cookie?.value;
}

// ============================================
// User Session Management
// ============================================

/**
 * Get the current authenticated user
 * 
 * @returns User payload or null if not authenticated
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Require authentication (for API routes)
 * 
 * Throws error if user is not authenticated
 * 
 * @param req - Next.js request object
 * @returns User payload
 * @throws Error if not authenticated
 */
export async function requireAuth(req: NextRequest): Promise<JWTPayload> {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const payload = await verifyToken(token);
  
  if (!payload) {
    throw new Error('Invalid token');
  }

  return payload;
}

/**
 * Check if user has required role
 * 
 * @param user - User payload
 * @param requiredRoles - Array of allowed roles
 * @returns True if user has required role
 */
export function hasRole(
  user: JWTPayload,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Require specific role (for API routes)
 * 
 * @param user - User payload
 * @param requiredRoles - Array of allowed roles
 * @throws Error if user doesn't have required role
 */
export function requireRole(
  user: JWTPayload,
  requiredRoles: UserRole[]
): void {
  if (!hasRole(user, requiredRoles)) {
    throw new Error('Forbidden');
  }
}

// ============================================
// Admin Check Helper
// ============================================

/**
 * Check if user is admin
 * 
 * @param user - User payload
 * @returns True if admin
 */
export function isAdmin(user: JWTPayload): boolean {
  return user.role === UserRole.ADMIN;
}

/**
 * Require admin role
 * 
 * @param user - User payload
 * @throws Error if not admin
 */
export function requireAdmin(user: JWTPayload): void {
  if (!isAdmin(user)) {
    throw new Error('Admin access required');
  }
}

/**
 * Require admin role (async version for API routes)
 * 
 * Gets current user and verifies admin role
 * @returns User payload if admin, null otherwise
 */
export async function requireAdminAuth(): Promise<JWTPayload | null> {
  const user = await getCurrentUser();
  
  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }
  
  return user;
}
