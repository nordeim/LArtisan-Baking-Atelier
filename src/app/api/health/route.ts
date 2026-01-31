import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Docker and monitoring
 * @returns 200 OK when service is healthy
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: "L'Artisan Baking Atelier",
      version: process.env.npm_package_version || '1.0.0',
    },
    { status: 200 }
  );
}
