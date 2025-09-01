import { eq } from "drizzle-orm";
import { db } from "./db"
import { exercises, InsertExercise, InsertWorkout, workouts } from "./schema"

export const createWorkout = async (workout: InsertWorkout & {exercises: Omit<InsertExercise, 'workoutId'>[]}) => {
    console.log('creating workout', workout);
    const [newWorkout] = await db.insert(workouts).values({
        name: workout.name,
        description: workout.description,
        userId: workout.userId,
    }).returning();

    console.log('creating exercises', workout.exercises);
    const exercisePromises = workout.exercises.map(async e => {
        return db.insert(exercises).values({
            ...e,
            workoutId: newWorkout.id
        });
    });

    Promise.all(exercisePromises);

    return newWorkout;
}

export const getWorkouts = async (userId: number) => {
    return await db.select().from(workouts).where(eq(workouts.userId, userId));
}

export const deleteWorkout = async (workoutId: number) => {
    return await db.delete(workouts).where(eq(workouts.id, workoutId));
}
