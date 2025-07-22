import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (kept from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// New models for workout functionality
export const workoutPrograms = pgTable("workout_programs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  author: text("author"),
  creationDate: text("creation_date"),
  modificationDate: text("modification_date"),
  tags: text("tags").array(),
  difficulty: text("difficulty"),
  formatVersion: text("format_version").notNull(),
  workoutPlan: jsonb("workout_plan").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertWorkoutSchema = createInsertSchema(workoutPrograms).omit({
  id: true
});

export type InsertWorkoutProgram = z.infer<typeof insertWorkoutSchema>;
export type WorkoutProgram = typeof workoutPrograms.$inferSelect;

// Recent workouts model
export const recentWorkouts = pgTable("recent_workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  workoutId: text("workout_id").references(() => workoutPrograms.id).notNull(),
  lastUsed: text("last_used").notNull(),
  totalDuration: integer("total_duration"),
  difficulty: text("difficulty"),
  mainSegmentType: text("main_segment_type"),
});

export const insertRecentWorkoutSchema = createInsertSchema(recentWorkouts).omit({
  id: true
});

export type InsertRecentWorkout = z.infer<typeof insertRecentWorkoutSchema>;
export type RecentWorkout = typeof recentWorkouts.$inferSelect;
