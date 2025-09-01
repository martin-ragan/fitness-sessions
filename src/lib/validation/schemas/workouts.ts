import { z } from 'zod';
import { createStringSchema, createOptionalStringSchema, createRangeSchema } from '../utils';
import type { InsertWorkout, InsertExercise } from '@/db/schema';
import type { WorkoutFormData } from '@/types/workout.types';

/**
 * Workout-specific validation schemas
 */

export const exerciseSchema = z.object({
  name: createStringSchema(1, 255, 'Exercise name'),
  description: createOptionalStringSchema(500),
  sets: createRangeSchema(1, 20, 'Sets'),
  reps: createRangeSchema(1, 100, 'Reps'),
}) satisfies z.ZodType<Omit<InsertExercise, 'id' | 'workoutId'>>;

export const workoutSchema = z.object({
  name: createStringSchema(1, 255, 'Workout name'),
  description: createOptionalStringSchema(1000),
}) satisfies z.ZodType<Omit<InsertWorkout, 'id' | 'userId'>>;

export const createWorkoutSchema = z.object({
  name: createStringSchema(1, 255, 'Workout name'),
  description: createOptionalStringSchema(1000),
  exercises: z.array(exerciseSchema)
    .min(1, 'At least one exercise is required')
    .max(50, 'Maximum 50 exercises allowed'),
}) satisfies z.ZodType<WorkoutFormData>;

// Export types for use in components
export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type WorkoutInput = z.infer<typeof workoutSchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;