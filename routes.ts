import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScheduleSchema, insertScheduleItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Schedule routes
  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.get("/api/schedules/:id", async (req, res) => {
    try {
      const schedule = await storage.getSchedule(req.params.id);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid schedule data" });
    }
  });

  app.put("/api/schedules/:id", async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateSchedule(req.params.id, validatedData);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid schedule data" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSchedule(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule" });
    }
  });

  // Schedule item routes
  app.get("/api/schedules/:scheduleId/items", async (req, res) => {
    try {
      const items = await storage.getScheduleItems(req.params.scheduleId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule items" });
    }
  });

  app.get("/api/schedule-items", async (req, res) => {
    try {
      const items = await storage.getAllScheduleItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule items" });
    }
  });

  app.post("/api/schedule-items", async (req, res) => {
    try {
      const validatedData = insertScheduleItemSchema.parse(req.body);
      const item = await storage.createScheduleItem(validatedData);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid schedule item data" });
    }
  });

  app.put("/api/schedule-items/:id", async (req, res) => {
    try {
      const validatedData = insertScheduleItemSchema.partial().parse(req.body);
      const item = await storage.updateScheduleItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Schedule item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid schedule item data" });
    }
  });

  app.delete("/api/schedule-items/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteScheduleItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Schedule item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
