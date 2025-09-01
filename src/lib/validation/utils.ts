import { z } from 'zod';
import { createActionError, type ActionError } from '@/types/actions';

/**
 * General validation utilities that can be reused across different domains
 */

// Common validation patterns
export const emailSchema = z.string().email('Invalid email format');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long');
export const positiveIntSchema = z.number().int().positive();
export const nonNegativeIntSchema = z.number().int().min(0);

// String validation helpers
export const createStringSchema = (
  minLength: number = 1,
  maxLength: number = 255,
  fieldName: string = 'Field'
) => z.string()
  .min(minLength, `${fieldName} must be at least ${minLength} characters`)
  .max(maxLength, `${fieldName} must be no more than ${maxLength} characters`);

export const createOptionalStringSchema = (maxLength: number = 255) => 
  z.string().max(maxLength).optional();

// Number validation helpers
export const createRangeSchema = (
  min: number,
  max: number,
  fieldName: string = 'Value'
) => z.number()
  .min(min, `${fieldName} must be at least ${min}`)
  .max(max, `${fieldName} must be no more than ${max}`);

// Validation error handler - converts Zod errors to ActionError format
export const handleValidationError = (error: z.ZodError): ActionError => {
  const fieldErrors: Record<string, string[]> = {};
  
  error.issues.forEach((err) => {
    const field = err.path.join('.');
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(err.message);
  });
  
  const mainError = error.issues[0]?.message || 'Validation failed';
  return createActionError(mainError, fieldErrors);
};

// Safe parse with ActionResult return type
export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: ActionError } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, error: handleValidationError(result.error) };
};