import { safeValidate } from '../utils';
import { createWorkoutSchema, type CreateWorkoutInput } from '../schemas/workouts';
import type { ActionError } from '@/types/actions';
import type { InsertExercise } from '@/db/schema';

/**
 * Workout form parsing utilities
 */

export const parseCreateWorkoutData = (data: {
  workoutName: string;
  workoutDescription?: string;
  exercises: Omit<InsertExercise, 'workoutId'>[];
}): { success: true; data: CreateWorkoutInput } | { success: false; error: ActionError } => {
  const rawData = {
    name: data.workoutName,
    description: data.workoutDescription,
    exercises: data.exercises,
  };

  return safeValidate(createWorkoutSchema, rawData);
};

// Alternative parser for direct form data (if needed in the future)
export const parseWorkoutFormData = (formData: FormData) => {
  // This could be implemented if you have a form that submits workout data directly
  // Currently your workout creation is handled via component state
  throw new Error('Direct form data parsing for workouts not implemented - use parseCreateWorkoutData instead');
};