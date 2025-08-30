import { type Schedule, type InsertSchedule, type ScheduleItem, type InsertScheduleItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Schedule operations
  getSchedules(): Promise<Schedule[]>;
  getSchedule(id: string): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: string): Promise<boolean>;

  // Schedule item operations
  getScheduleItems(scheduleId: string): Promise<ScheduleItem[]>;
  getScheduleItem(id: string): Promise<ScheduleItem | undefined>;
  createScheduleItem(item: InsertScheduleItem): Promise<ScheduleItem>;
  updateScheduleItem(id: string, item: Partial<InsertScheduleItem>): Promise<ScheduleItem | undefined>;
  deleteScheduleItem(id: string): Promise<boolean>;
  
  // Get all schedule items for dashboard
  getAllScheduleItems(): Promise<ScheduleItem[]>;
}

export class MemStorage implements IStorage {
  private schedules: Map<string, Schedule>;
  private scheduleItems: Map<string, ScheduleItem>;

  constructor() {
    this.schedules = new Map();
    this.scheduleItems = new Map();
    this.seedData();
  }

  private seedData() {
    // Create initial schedules - now representing school schedules
    const thursdaySchedule: Schedule = {
      id: "thursday-schedule",
      name: "Thursday Classes",
      description: "Thursday, August 28, 2025",
      category: "academic",
      color: "hsl(221.2 83.2% 53.3%)",
      isActive: true,
      createdAt: new Date("2025-08-28"),
      updatedAt: new Date("2025-08-28"),
    };

    const mondaySchedule: Schedule = {
      id: "monday-schedule", 
      name: "Monday Classes",
      description: "Monday class schedule",
      category: "academic",
      color: "hsl(142.1 76.2% 36.3%)",
      isActive: true,
      createdAt: new Date("2025-08-25"),
      updatedAt: new Date("2025-08-25"),
    };

    const wednesdaySchedule: Schedule = {
      id: "wednesday-schedule",
      name: "Wednesday Classes", 
      description: "Wednesday class schedule",
      category: "academic",
      color: "hsl(24.6 95% 53.1%)",
      isActive: true,
      createdAt: new Date("2025-08-27"),
      updatedAt: new Date("2025-08-27"),
    };

    const tuesdaySchedule: Schedule = {
      id: "tuesday-schedule",
      name: "Tuesday Classes", 
      description: "Tuesday class schedule",
      category: "academic",
      color: "hsl(262.1 83.3% 57.8%)",
      isActive: true,
      createdAt: new Date("2025-08-26"),
      updatedAt: new Date("2025-08-26"),
    };

    const fridaySchedule: Schedule = {
      id: "friday-schedule",
      name: "Friday Classes", 
      description: "Friday class schedule",
      category: "academic",
      color: "hsl(348.83 100% 60%)",
      isActive: true,
      createdAt: new Date("2025-08-29"),
      updatedAt: new Date("2025-08-29"),
    };

    this.schedules.set(mondaySchedule.id, mondaySchedule);
    this.schedules.set(tuesdaySchedule.id, tuesdaySchedule);
    this.schedules.set(wednesdaySchedule.id, wednesdaySchedule);
    this.schedules.set(thursdaySchedule.id, thursdaySchedule);
    this.schedules.set(fridaySchedule.id, fridaySchedule);

    // Create full week block schedule based on the blueprint
    const sampleItems: ScheduleItem[] = [
      // MONDAY (dayOfWeek: 1) - A, B, C, Crew, E, Chow, F, G
      { id: "mon-1", scheduleId: "monday-schedule", title: "Block A", description: "PLTW Computer Science A", teacher: "Yeager, Gabriel", room: "230", period: 1, grade: "11", dayOfWeek: 1, startTime: "07:45", endTime: "08:44", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "mon-2", scheduleId: "monday-schedule", title: "Block B", description: "Pre AP Algebra II", teacher: "Cohen, Craig", room: "333", period: 2, grade: "11", dayOfWeek: 1, startTime: "08:44", endTime: "09:43", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "mon-3", scheduleId: "monday-schedule", title: "Block C", description: "French II Honors", teacher: "Ryan, Candace", room: "326", period: 3, grade: "11", dayOfWeek: 1, startTime: "09:44", endTime: "10:35", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "mon-4", scheduleId: "monday-schedule", title: "Crew", description: "Advisory/homeroom period", teacher: "Desmond, Teague", room: "305", period: 4, grade: "11", dayOfWeek: 1, startTime: "10:39", endTime: "11:07", duration: 28, isCompleted: false, createdAt: new Date() },
      { id: "mon-5", scheduleId: "monday-schedule", title: "Block E", description: "Leadership ROTC", teacher: "Sumner, John", room: "139", period: 5, grade: "11", dayOfWeek: 1, startTime: "11:11", endTime: "12:05", duration: 54, isCompleted: false, createdAt: new Date() },
      { id: "mon-6", scheduleId: "monday-schedule", title: "Chow", description: "Lunch period", teacher: "Cafeteria Staff", room: "Cafeteria", period: 6, grade: "11", dayOfWeek: 1, startTime: "12:49", endTime: "13:40", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "mon-7", scheduleId: "monday-schedule", title: "Block F", description: "AP English", teacher: "Kalinowski, Jill", room: "204", period: 7, grade: "11", dayOfWeek: 1, startTime: "13:45", endTime: "14:37", duration: 52, isCompleted: false, createdAt: new Date() },
      { id: "mon-8", scheduleId: "monday-schedule", title: "Block G", description: "Early College Business", teacher: "Trammell, Anna", room: "IMC2", period: 8, grade: "11", dayOfWeek: 1, startTime: "15:41", endTime: "16:25", duration: 44, isCompleted: false, createdAt: new Date() },

      // TUESDAY (dayOfWeek: 2) - B, C, D, Crew, F, Chow, G, H  
      { id: "tue-1", scheduleId: "tuesday-schedule", title: "Block B", description: "Pre AP Algebra II", teacher: "Cohen, Craig", room: "333", period: 1, grade: "11", dayOfWeek: 2, startTime: "07:45", endTime: "08:44", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "tue-2", scheduleId: "tuesday-schedule", title: "Block C", description: "French II Honors", teacher: "Ryan, Candace", room: "326", period: 2, grade: "11", dayOfWeek: 2, startTime: "08:44", endTime: "09:43", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "tue-3", scheduleId: "tuesday-schedule", title: "Block D", description: "Study Skills", teacher: "Academic Support", room: "Library", period: 3, grade: "11", dayOfWeek: 2, startTime: "09:44", endTime: "10:35", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "tue-4", scheduleId: "tuesday-schedule", title: "Crew", description: "Advisory/homeroom period", teacher: "Desmond, Teague", room: "305", period: 4, grade: "11", dayOfWeek: 2, startTime: "10:39", endTime: "11:07", duration: 28, isCompleted: false, createdAt: new Date() },
      { id: "tue-5", scheduleId: "tuesday-schedule", title: "Block F", description: "AP English", teacher: "Kalinowski, Jill", room: "204", period: 5, grade: "11", dayOfWeek: 2, startTime: "11:11", endTime: "12:05", duration: 54, isCompleted: false, createdAt: new Date() },
      { id: "tue-6", scheduleId: "tuesday-schedule", title: "Chow", description: "Lunch period", teacher: "Cafeteria Staff", room: "Cafeteria", period: 6, grade: "11", dayOfWeek: 2, startTime: "12:49", endTime: "13:40", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "tue-7", scheduleId: "tuesday-schedule", title: "Block G", description: "Early College Business", teacher: "Trammell, Anna", room: "IMC2", period: 7, grade: "11", dayOfWeek: 2, startTime: "13:45", endTime: "14:37", duration: 52, isCompleted: false, createdAt: new Date() },
      { id: "tue-8", scheduleId: "tuesday-schedule", title: "Block H", description: "Physical Education", teacher: "Coach Martinez", room: "Gymnasium", period: 8, grade: "11", dayOfWeek: 2, startTime: "15:41", endTime: "16:25", duration: 44, isCompleted: false, createdAt: new Date() },

      // WEDNESDAY (dayOfWeek: 3) - A, B, C, Crew, F, Chow, G, H
      { id: "wed-1", scheduleId: "wednesday-schedule", title: "Block A", description: "PLTW Computer Science A", teacher: "Yeager, Gabriel", room: "230", period: 1, grade: "11", dayOfWeek: 3, startTime: "07:45", endTime: "08:44", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "wed-2", scheduleId: "wednesday-schedule", title: "Block B", description: "Pre AP Algebra II", teacher: "Cohen, Craig", room: "333", period: 2, grade: "11", dayOfWeek: 3, startTime: "08:44", endTime: "09:43", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "wed-3", scheduleId: "wednesday-schedule", title: "Block C", description: "French II Honors", teacher: "Ryan, Candace", room: "326", period: 3, grade: "11", dayOfWeek: 3, startTime: "09:44", endTime: "10:35", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "wed-4", scheduleId: "wednesday-schedule", title: "Crew", description: "Advisory/homeroom period", teacher: "Desmond, Teague", room: "305", period: 4, grade: "11", dayOfWeek: 3, startTime: "10:39", endTime: "11:07", duration: 28, isCompleted: false, createdAt: new Date() },
      { id: "wed-5", scheduleId: "wednesday-schedule", title: "Block F", description: "AP English", teacher: "Kalinowski, Jill", room: "204", period: 5, grade: "11", dayOfWeek: 3, startTime: "11:11", endTime: "12:05", duration: 54, isCompleted: false, createdAt: new Date() },
      { id: "wed-6", scheduleId: "wednesday-schedule", title: "Chow", description: "Lunch period", teacher: "Cafeteria Staff", room: "Cafeteria", period: 6, grade: "11", dayOfWeek: 3, startTime: "12:49", endTime: "13:40", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "wed-7", scheduleId: "wednesday-schedule", title: "Block G", description: "Early College Business", teacher: "Trammell, Anna", room: "IMC2", period: 7, grade: "11", dayOfWeek: 3, startTime: "13:45", endTime: "14:37", duration: 52, isCompleted: false, createdAt: new Date() },
      { id: "wed-8", scheduleId: "wednesday-schedule", title: "Block H", description: "Physical Education", teacher: "Coach Martinez", room: "Gymnasium", period: 8, grade: "11", dayOfWeek: 3, startTime: "15:41", endTime: "16:25", duration: 44, isCompleted: false, createdAt: new Date() },

      // THURSDAY (dayOfWeek: 4) - C, D, A, Crew, E, Chow, F, G
      { id: "thu-1", scheduleId: "thursday-schedule", title: "Block C", description: "French II Honors", teacher: "Ryan, Candace", room: "326", period: 1, grade: "11", dayOfWeek: 4, startTime: "07:45", endTime: "08:44", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "thu-2", scheduleId: "thursday-schedule", title: "Block D", description: "Study Skills", teacher: "Academic Support", room: "Library", period: 2, grade: "11", dayOfWeek: 4, startTime: "08:44", endTime: "09:43", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "thu-3", scheduleId: "thursday-schedule", title: "Block A", description: "PLTW Computer Science A", teacher: "Yeager, Gabriel", room: "230", period: 3, grade: "11", dayOfWeek: 4, startTime: "09:44", endTime: "10:35", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "thu-4", scheduleId: "thursday-schedule", title: "Crew", description: "Advisory/homeroom period", teacher: "Desmond, Teague", room: "305", period: 4, grade: "11", dayOfWeek: 4, startTime: "10:39", endTime: "11:07", duration: 28, isCompleted: false, createdAt: new Date() },
      { id: "thu-5", scheduleId: "thursday-schedule", title: "Block E", description: "Leadership ROTC", teacher: "Sumner, John", room: "139", period: 5, grade: "11", dayOfWeek: 4, startTime: "11:11", endTime: "12:05", duration: 54, isCompleted: false, createdAt: new Date() },
      { id: "thu-6", scheduleId: "thursday-schedule", title: "Chow", description: "Lunch period", teacher: "Cafeteria Staff", room: "Cafeteria", period: 6, grade: "11", dayOfWeek: 4, startTime: "12:49", endTime: "13:40", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "thu-7", scheduleId: "thursday-schedule", title: "Block F", description: "AP English", teacher: "Kalinowski, Jill", room: "204", period: 7, grade: "11", dayOfWeek: 4, startTime: "13:45", endTime: "14:37", duration: 52, isCompleted: false, createdAt: new Date() },
      { id: "thu-8", scheduleId: "thursday-schedule", title: "Block G", description: "Early College Business", teacher: "Trammell, Anna", room: "IMC2", period: 8, grade: "11", dayOfWeek: 4, startTime: "15:41", endTime: "16:25", duration: 44, isCompleted: false, createdAt: new Date() },

      // FRIDAY (dayOfWeek: 5) - D, A, B, Crew, E, Chow, F, H
      { id: "fri-1", scheduleId: "friday-schedule", title: "Block D", description: "Study Skills", teacher: "Academic Support", room: "Library", period: 1, grade: "11", dayOfWeek: 5, startTime: "07:45", endTime: "08:44", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "fri-2", scheduleId: "friday-schedule", title: "Block A", description: "PLTW Computer Science A", teacher: "Yeager, Gabriel", room: "230", period: 2, grade: "11", dayOfWeek: 5, startTime: "08:44", endTime: "09:43", duration: 59, isCompleted: false, createdAt: new Date() },
      { id: "fri-3", scheduleId: "friday-schedule", title: "Block B", description: "Pre AP Algebra II", teacher: "Cohen, Craig", room: "333", period: 3, grade: "11", dayOfWeek: 5, startTime: "09:44", endTime: "10:35", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "fri-4", scheduleId: "friday-schedule", title: "Crew", description: "Advisory/homeroom period", teacher: "Desmond, Teague", room: "305", period: 4, grade: "11", dayOfWeek: 5, startTime: "10:39", endTime: "11:07", duration: 28, isCompleted: false, createdAt: new Date() },
      { id: "fri-5", scheduleId: "friday-schedule", title: "Block E", description: "Leadership ROTC", teacher: "Sumner, John", room: "139", period: 5, grade: "11", dayOfWeek: 5, startTime: "11:11", endTime: "12:05", duration: 54, isCompleted: false, createdAt: new Date() },
      { id: "fri-6", scheduleId: "friday-schedule", title: "Chow", description: "Lunch period", teacher: "Cafeteria Staff", room: "Cafeteria", period: 6, grade: "11", dayOfWeek: 5, startTime: "12:49", endTime: "13:40", duration: 51, isCompleted: false, createdAt: new Date() },
      { id: "fri-7", scheduleId: "friday-schedule", title: "Block F", description: "AP English", teacher: "Kalinowski, Jill", room: "204", period: 7, grade: "11", dayOfWeek: 5, startTime: "13:45", endTime: "14:37", duration: 52, isCompleted: false, createdAt: new Date() },
      { id: "fri-8", scheduleId: "friday-schedule", title: "Block H", description: "Physical Education", teacher: "Coach Martinez", room: "Gymnasium", period: 8, grade: "11", dayOfWeek: 5, startTime: "15:41", endTime: "16:25", duration: 44, isCompleted: false, createdAt: new Date() },
    ];

    sampleItems.forEach(item => this.scheduleItems.set(item.id, item));
  }

  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values());
  }

  async getSchedule(id: string): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const id = randomUUID();
    const now = new Date();
    const schedule: Schedule = {
      ...insertSchedule,
      id,
      isActive: insertSchedule.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.schedules.set(id, schedule);
    return schedule;
  }

  async updateSchedule(id: string, updateData: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const existing = this.schedules.get(id);
    if (!existing) return undefined;

    const updated: Schedule = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.schedules.set(id, updated);
    return updated;
  }

  async deleteSchedule(id: string): Promise<boolean> {
    const deleted = this.schedules.delete(id);
    // Also delete all related schedule items
    const itemsToDelete = Array.from(this.scheduleItems.values())
      .filter(item => item.scheduleId === id)
      .map(item => item.id);
    
    itemsToDelete.forEach(itemId => this.scheduleItems.delete(itemId));
    return deleted;
  }

  async getScheduleItems(scheduleId: string): Promise<ScheduleItem[]> {
    return Array.from(this.scheduleItems.values())
      .filter(item => item.scheduleId === scheduleId);
  }

  async getAllScheduleItems(): Promise<ScheduleItem[]> {
    return Array.from(this.scheduleItems.values());
  }

  async getScheduleItem(id: string): Promise<ScheduleItem | undefined> {
    return this.scheduleItems.get(id);
  }

  async createScheduleItem(insertItem: InsertScheduleItem): Promise<ScheduleItem> {
    const id = randomUUID();
    const item: ScheduleItem = {
      ...insertItem,
      id,
      description: insertItem.description ?? null,
      teacher: insertItem.teacher ?? null,
      room: insertItem.room ?? null,
      period: insertItem.period ?? null,
      grade: insertItem.grade ?? null,
      isCompleted: insertItem.isCompleted ?? false,
      createdAt: new Date(),
    };
    this.scheduleItems.set(id, item);
    return item;
  }

  async updateScheduleItem(id: string, updateData: Partial<InsertScheduleItem>): Promise<ScheduleItem | undefined> {
    const existing = this.scheduleItems.get(id);
    if (!existing) return undefined;

    const updated: ScheduleItem = {
      ...existing,
      ...updateData,
    };
    this.scheduleItems.set(id, updated);
    return updated;
  }

  async deleteScheduleItem(id: string): Promise<boolean> {
    return this.scheduleItems.delete(id);
  }
}

export const storage = new MemStorage();
