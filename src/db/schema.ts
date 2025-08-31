import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { bytea } from "./bytea";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

/* Session Table */
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().notNull(),
  secret: bytea().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").references(() => users.id).notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  workoutId: integer("workout_id").references(() => workouts.id).notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
});

export const workout_sessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").references(() => workouts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const series_sessions = pgTable("series_sessions", {
  id: serial("id").primaryKey(),
  workoutSessionId: integer("workout_session_id").references(() => workout_sessions.id).notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps").notNull(),
  weight: integer("weight").notNull(),
});

export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;
export type SelectWorkout = typeof workouts.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;
export type SelectExercise = typeof exercises.$inferSelect;
export type InsertWorkoutSession = typeof workout_sessions.$inferInsert;
export type SelectWorkoutSession = typeof workout_sessions.$inferSelect;
export type InsertSeriesSession = typeof series_sessions.$inferInsert;
export type SelectSeriesSession = typeof series_sessions.$inferSelect;
