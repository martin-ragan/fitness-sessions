import { z } from 'zod';
import { emailSchema, passwordSchema } from '../utils';
import type { InsertUser } from '@/db/schema';

/**
 * Authentication-specific validation schemas
 */

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
}) satisfies z.ZodType<Omit<InsertUser, 'id'>>;

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Export types for use in components
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;