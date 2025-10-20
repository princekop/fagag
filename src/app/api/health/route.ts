/**
 * Health check endpoint for production monitoring
 * Verifies application status, database connectivity, and environment configuration
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  checks: {
    database: 'ok' | 'error';
    environment: 'ok' | 'error';
  };
  version?: string;
  error?: string;
}

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const startTime = Date.now();
  
  const healthCheck: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'unknown',
    checks: {
      database: 'ok',
      environment: 'ok',
    },
  };

  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.checks.database = 'ok';
  } catch (error) {
    console.error('Health check - Database error:', error);
    healthCheck.checks.database = 'error';
    healthCheck.status = 'unhealthy';
    healthCheck.error = 'Database connection failed';
  }

  // Check critical environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'PTERO_PANEL_URL',
    'PTERO_API_KEY',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    healthCheck.checks.environment = 'error';
    healthCheck.status = 'unhealthy';
    healthCheck.error = `Missing environment variables: ${missingVars.join(', ')}`;
  }

  const responseTime = Date.now() - startTime;
  
  // Return appropriate status code
  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json(healthCheck, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Response-Time': `${responseTime}ms`,
    },
  });
}
