import { safeValidate } from '../utils';
import { workoutSessionSchema, type WorkoutSessionInput, type SetDataInput } from '../schemas/sessions';
import type { ActionError } from '@/types/actions';

/**
 * Session form parsing utilities
 */

export const parseWorkoutSessionFormData = (
  workoutId: number,
  formData: FormData
): { success: true; data: WorkoutSessionInput } | { success: false; error: ActionError } => {
  const sets: SetDataInput[] = [];
  const entries = Array.from(formData.entries());
  
  // Parse weight/reps pairs from form data
  for (const [key, value] of entries) {
    if (key.startsWith('weight_')) {
      const [, exerciseIdStr, setNumberStr] = key.split('_');
      const exerciseId = parseInt(exerciseIdStr);
      const setNumber = parseInt(setNumberStr);
      
      if (isNaN(exerciseId) || isNaN(setNumber)) {
        continue; // Skip invalid entries
      }
      
      const repsKey = `reps_${exerciseIdStr}_${setNumberStr}`;
      const weight = parseFloat(value as string) || 0;
      const reps = parseFloat(formData.get(repsKey) as string) || 0;
      
      // Only add if we have meaningful data
      if (weight > 0 || reps > 0) {
        sets.push({
          exerciseId,
          setNumber,
          weight,
          reps,
        });
      }
    }
  }
  
  const rawData = {
    workoutId,
    sets,
  };
  
  return safeValidate(workoutSessionSchema, rawData);
};

// Helper to parse individual set data (useful for real-time validation)
export const parseSetData = (
  exerciseId: number,
  setNumber: number, 
  weight: string | number,
  reps: string | number
): { success: true; data: SetDataInput } | { success: false; error: ActionError } => {
  const rawData = {
    exerciseId,
    setNumber,
    weight: typeof weight === 'string' ? parseFloat(weight) || 0 : weight,
    reps: typeof reps === 'string' ? parseFloat(reps) || 0 : reps,
  };
  
  return safeValidate(workoutSessionSchema.shape.sets.element, rawData);
};