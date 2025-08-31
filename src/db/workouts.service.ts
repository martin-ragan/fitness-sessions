import { eq } from "drizzle-orm";
import { db } from "./db"
import { InsertWorkout, workouts } from "./schema"

export const createWorkout = async (workout: InsertWorkout) => {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();

    return newWorkout;
}

export const getWorkouts = async (userId: number) => {
    return await db.select().from(workouts).where(eq(workouts.userId, userId));
}

export const deleteWorkout = async (workoutId: number) => {
    return await db.delete(workouts).where(eq(workouts.id, workoutId));
}
