/**
 * Environment validation for production deployment
 * Validates all required environment variables at build time
 */

import { z } from 'zod';

const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

  // Pterodactyl Panel
  PTERO_PANEL_URL: z.string().url('PTERO_PANEL_URL must be a valid URL'),
  PTERO_API_KEY: z.string().min(1, 'PTERO_API_KEY is required'),
  PTERO_CLIENT_API_KEY: z.string().min(1, 'PTERO_CLIENT_API_KEY is required'),
  NEXT_PUBLIC_PTERO_PANEL_URL: z.string().url('NEXT_PUBLIC_PTERO_PANEL_URL must be a valid URL'),

  // Encryption
  PTERO_CRED_KEY: z.string().length(32, 'PTERO_CRED_KEY must be exactly 32 characters'),

  // Optional provisioning settings
  PTERO_EGG_ID: z.string().optional(),
  PTERO_DOCKER_IMAGE: z.string().optional(),
  PTERO_STARTUP: z.string().optional(),
  PTERO_LOCATION_IDS: z.string().optional(),
  PTERO_ENV_JSON: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables
 * @throws {Error} if validation fails
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    
    // Additional production-specific validations
    if (env.NODE_ENV === 'production') {
      if (env.NEXTAUTH_SECRET === 'your-secret-key-here') {
        throw new Error('NEXTAUTH_SECRET must be changed from default value in production');
      }
      
      if (env.PTERO_CRED_KEY === 'your-32-char-encryption-key-here') {
        throw new Error('PTERO_CRED_KEY must be changed from default value in production');
      }

      if (!env.NEXTAUTH_URL.startsWith('https://')) {
        console.warn('⚠️ Warning: NEXTAUTH_URL should use HTTPS in production');
      }
    }

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error('❌ Environment validation failed:', error);
    }
    throw new Error('Invalid environment configuration');
  }
}

// Validate on import in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}

// Export validated env
export const env = validateEnv();
