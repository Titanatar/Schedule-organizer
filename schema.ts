import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // work, personal, fitness, social
  color: text("color").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const scheduleItems = pgTable("schedule_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scheduleId: varchar("schedule_id").notNull().references(() => schedules.id, { onDelete: "cascade" }),
  title: text("title").notNull(), // Class name
  description: text("description"),
  teacher: text("teacher"), // Teacher name(s)
  room: text("room"), // Room number/location
  period: integer("period"), // Class period number
  grade: text("grade"), // Grade level
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // HH:mm format
  endTime: text("end_time").notNull(), // HH:mm format
  duration: integer("duration").notNull(), // duration in minutes
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScheduleItemSchema = createInsertSchema(scheduleItems).omit({
  id: true,
  createdAt: true,
});

export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type ScheduleItem = typeof scheduleItems.$inferSelect;
