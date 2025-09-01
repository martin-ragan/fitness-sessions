'use server';

import { getCurrentSession } from '@/lib/get-current-session';
import { createWorkoutSession, saveSeriesSession } from '@/db/workoutSession.service';
import { redirect } from 'next/navigation';
import { parseWorkoutSessionFormData } from '@/lib/validation';

export async function saveWorkoutSession(workoutId: number, formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Validate form data
  const validationResult = parseWorkoutSessionFormData(workoutId, formData);
  if (!validationResult.success) {
    // For redirect-based forms, we could log the error and redirect with error state
    console.error('Validation error:', validationResult.error);
    redirect('/workouts?error=validation');
  }

  const { sets } = validationResult.data;

  try {
    // Create workout session
    const workoutSession = await createWorkoutSession(workoutId, session.userId);

    // Save all series data
    const setPromises = sets.map(set => 
      saveSeriesSession(
        workoutSession.id,
        set.exerciseId,
        set.setNumber,
        set.reps,
        set.weight
      )
    );

    await Promise.all(setPromises);
    
    console.log('Workout session saved successfully');
  } catch (error) {
    console.error('Error saving workout session:', error);
    redirect('/workouts?error=save');
  }

  redirect('/workouts');
}