import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { 
    workout_sessions, 
    series_sessions, 
    workouts, 
    exercises,
    InsertWorkoutSession,
    InsertSeriesSession,
    SelectWorkoutSession,
    SelectSeriesSession 
} from "./schema";
import { 
    WorkoutWithExercises, 
    SessionHistoryItem, 
    WorkoutStats, 
    PreviousSetData 
} from "@/types/workout.types";

export const createWorkoutSession = async (workoutId: number, userId: number) => {
    const [newSession] = await db.insert(workout_sessions).values({
        workoutId,
        userId,
    }).returning();
    
    return newSession;
};

export const getWorkoutWithExercises = async (workoutId: number, userId: number): Promise<WorkoutWithExercises> => {
    const workout = await db
        .select()
        .from(workouts)
        .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
        .limit(1);
    
    if (!workout.length) {
        throw new Error("Workout not found or access denied");
    }
    
    const workoutExercises = await db
        .select()
        .from(exercises)
        .where(eq(exercises.workoutId, workoutId));
    
    return {
        ...workout[0],
        exercises: workoutExercises
    };
};

export const saveSeriesSession = async (
    workoutSessionId: number,
    exerciseId: number,
    setNumber: number,
    reps: number,
    weight: number
) => {
    const existingSeries = await db
        .select()
        .from(series_sessions)
        .where(
            and(
                eq(series_sessions.workoutSessionId, workoutSessionId),
                eq(series_sessions.exerciseId, exerciseId),
                eq(series_sessions.setNumber, setNumber)
            )
        )
        .limit(1);
    
    if (existingSeries.length > 0) {
        const [updatedSeries] = await db
            .update(series_sessions)
            .set({ reps, weight })
            .where(eq(series_sessions.id, existingSeries[0].id))
            .returning();
        
        return updatedSeries;
    } else {
        const [newSeries] = await db
            .insert(series_sessions)
            .values({
                workoutSessionId,
                exerciseId,
                setNumber,
                reps,
                weight
            })
            .returning();
        
        return newSeries;
    }
};

export const getWorkoutSessionProgress = async (sessionId: number): Promise<PreviousSetData[]> => {
    const seriesSessions = await db
        .select({
            id: series_sessions.id,
            exerciseId: series_sessions.exerciseId,
            setNumber: series_sessions.setNumber,
            reps: series_sessions.reps,
            weight: series_sessions.weight,
            exerciseName: exercises.name,
            plannedSets: exercises.sets,
            plannedReps: exercises.reps
        })
        .from(series_sessions)
        .innerJoin(exercises, eq(series_sessions.exerciseId, exercises.id))
        .where(eq(series_sessions.workoutSessionId, sessionId));
    
    return seriesSessions;
};

export const getWorkoutSession = async (sessionId: number, userId: number) => {
    const session = await db
        .select({
            id: workout_sessions.id,
            workoutId: workout_sessions.workoutId,
            userId: workout_sessions.userId,
            createdAt: workout_sessions.createdAt,
            workoutName: workouts.name,
            workoutDescription: workouts.description
        })
        .from(workout_sessions)
        .innerJoin(workouts, eq(workout_sessions.workoutId, workouts.id))
        .where(
            and(
                eq(workout_sessions.id, sessionId),
                eq(workout_sessions.userId, userId)
            )
        )
        .limit(1);
    
    if (!session.length) {
        throw new Error("Workout session not found or access denied");
    }
    
    return session[0];
};

export const getPreviousSessionData = async (workoutId: number, userId: number): Promise<PreviousSetData[] | null> => {
    const lastSession = await db
        .select()
        .from(workout_sessions)
        .where(
            and(
                eq(workout_sessions.workoutId, workoutId),
                eq(workout_sessions.userId, userId)
            )
        )
        .orderBy(workout_sessions.createdAt)
        .limit(1);
    
    if (!lastSession.length) {
        return null;
    }
    
    const lastSessionData = await getWorkoutSessionProgress(lastSession[0].id);
    return lastSessionData;
};

export const deleteWorkoutSession = async (sessionId: number, userId: number) => {
    await db
        .delete(series_sessions)
        .where(eq(series_sessions.workoutSessionId, sessionId));
    
    const deletedSession = await db
        .delete(workout_sessions)
        .where(
            and(
                eq(workout_sessions.id, sessionId),
                eq(workout_sessions.userId, userId)
            )
        )
        .returning();
    
    return deletedSession;
};

export const getWorkoutSessionHistory = async (workoutId: number, userId: number): Promise<SessionHistoryItem[]> => {
    const sessions = await db
        .select({
            sessionId: workout_sessions.id,
            sessionDate: workout_sessions.createdAt,
            exerciseId: exercises.id,
            exerciseName: exercises.name,
            setNumber: series_sessions.setNumber,
            reps: series_sessions.reps,
            weight: series_sessions.weight
        })
        .from(workout_sessions)
        .innerJoin(series_sessions, eq(workout_sessions.id, series_sessions.workoutSessionId))
        .innerJoin(exercises, eq(series_sessions.exerciseId, exercises.id))
        .where(
            and(
                eq(workout_sessions.workoutId, workoutId),
                eq(workout_sessions.userId, userId)
            )
        )
        .orderBy(workout_sessions.createdAt);

    // Group by session and exercise
    const groupedSessions = sessions.reduce((acc, row) => {
        const sessionKey = `${row.sessionId}`;
        const exerciseKey = `${row.exerciseId}`;
        
        if (!acc[sessionKey]) {
            acc[sessionKey] = {
                id: row.sessionId,
                date: row.sessionDate.toISOString().split('T')[0],
                exercises: {}
            };
        }
        
        if (!acc[sessionKey].exercises[exerciseKey]) {
            acc[sessionKey].exercises[exerciseKey] = {
                name: row.exerciseName,
                sets: []
            };
        }
        
        acc[sessionKey].exercises[exerciseKey].sets.push({
            reps: row.reps,
            weight: row.weight
        });
        
        return acc;
    }, {} as Record<string, any>);

    // Convert to array and transform exercises object to array
    return Object.values(groupedSessions).map((session: any) => ({
        id: session.id,
        date: session.date,
        exercises: Object.values(session.exercises)
    }));
};

export const getWorkoutStats = async (workoutId: number, userId: number): Promise<WorkoutStats> => {
    const totalSessions = await db
        .select()
        .from(workout_sessions)
        .where(
            and(
                eq(workout_sessions.workoutId, workoutId),
                eq(workout_sessions.userId, userId)
            )
        );

    return {
        totalSessions: totalSessions.length
    };
};