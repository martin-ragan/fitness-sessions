import { z } from 'zod';
import { positiveIntSchema, createRangeSchema } from '../utils';
import type { SetInputData } from '@/types/workout.types';

/**
 * Session-specific validation schemas
 */

export const setDataSchema = z.object({
  exerciseId: positiveIntSchema,
  setNumber: z.number().int().min(1, 'Set number must be at least 1'),
  weight: createRangeSchema(0, 1000, 'Weight'),
  reps: createRangeSchema(0, 100, 'Reps'),
}) satisfies z.ZodType<SetInputData>;

export const workoutSessionSchema = z.object({
  workoutId: positiveIntSchema,
  sets: z.array(setDataSchema)
    .min(1, 'At least one set is required')
    .max(200, 'Too many sets in one session'),
});

// Validation for individual set input (used in forms)
export const singleSetSchema = z.object({
  weight: createRangeSchema(0, 1000, 'Weight'),
  reps: createRangeSchema(0, 100, 'Reps'),
});

// Export types for use in components
export type SetDataInput = z.infer<typeof setDataSchema>;
export type WorkoutSessionInput = z.infer<typeof workoutSessionSchema>;
export type SingleSetInput = z.infer<typeof singleSetSchema>;