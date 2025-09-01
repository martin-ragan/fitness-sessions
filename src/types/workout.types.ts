// Base types from database schema
export type SelectWorkout = {
  id: number;
  name: string;
  description: string | null;
  userId: number;
};

export type SelectExercise = {
  id: number;
  name: string;
  description: string | null;
  workoutId: number;
  sets: number;
  reps: number;
};

export type SelectWorkoutSession = {
  id: number;
  workoutId: number;
  userId: number;
  createdAt: Date;
};

export type SelectSeriesSession = {
  id: number;
  workoutSessionId: number;
  exerciseId: number;
  setNumber: number;
  reps: number;
  weight: number;
};

// Composed types for UI components
export interface WorkoutWithExercises extends SelectWorkout {
  exercises: SelectExercise[];
}

export interface ExerciseSessionData {
  name: string;
  sets: {
    reps: number;
    weight: number;
  }[];
}

export interface SessionHistoryItem {
  id: number;
  date: string;
  exercises: ExerciseSessionData[];
}

export interface PreviousSetData {
  exerciseId: number;
  setNumber: number;
  reps: number;
  weight: number;
  exerciseName: string;
  plannedSets: number;
  plannedReps: number;
}

// Stats and analytics types
export interface WorkoutStats {
  totalSessions: number;
  averageImprovement?: number;
  totalVolume?: number;
  lastWorkoutDate?: string;
}

// Form and input types
export interface SetInputData {
  exerciseId: number;
  setNumber: number;
  weight: number;
  reps: number;
}

export interface WorkoutFormData {
  name: string;
  description?: string;
  exercises: {
    name: string;
    description?: string;
    sets: number;
    reps: number;
  }[];
}

// API response types
export interface WorkoutSessionResponse {
  success: boolean;
  sessionId?: number;
  error?: string;
}

export interface SessionProgressResponse {
  exercises: {
    exerciseId: number;
    exerciseName: string;
    completedSets: number;
    totalSets: number;
    sets: {
      setNumber: number;
      reps: number;
      weight: number;
      completed: boolean;
    }[];
  }[];
}