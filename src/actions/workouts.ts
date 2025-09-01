'use server';

import { createWorkout } from "@/db/workouts.service";
import { parseCreateWorkoutData } from '@/lib/validation';
import { createActionSuccess, createActionError, type ActionResult } from '@/types/actions';
import type { InsertExercise } from "@/db/schema";

export const createWorkoutAction = async (data: {
    workoutName: string;
    userId: number;
    workoutDescription?: string;
    exercises: Omit<InsertExercise, 'workoutId'>[];
}): Promise<ActionResult> => {
    'use server';

    // Validate input data
    const validationResult = parseCreateWorkoutData(data);
    if (!validationResult.success) {
        return validationResult.error;
    }

    const { name, description, exercises } = validationResult.data;

    try {
        await createWorkout({
            name,
            description,
            exercises,
            userId: data.userId
        });
        
        return createActionSuccess();
    } catch (error) {
        console.error('CreateWorkout error:', error);
        return createActionError('Failed to create workout');
    }
}