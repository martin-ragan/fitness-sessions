'use server';
import { InsertExercise } from "@/db/schema";
import { createWorkout } from "@/db/workouts.service";

export const createWorkoutAction = async (data: {
    workoutName: string;
    userId: number;
    workoutDescription?: string;
    exercises: Omit<InsertExercise, 'workoutId'>[];
}) => {
    'use server';

    console.log('new workout is ready', data)
    try {
        await createWorkout({
            name: data.workoutName,
            description: data.workoutDescription,
            exercises: data.exercises,
            userId: data.userId
        })
    } catch(e: unknown) {

    }
}