import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { handleChatMessage } from "./openai";
import { calculationFormSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.post("/api/calculations", async (req, res) => {
    try {
      const data = calculationFormSchema.parse(req.body);
      const calculation = await storage.saveCalculation(data);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await handleChatMessage(message);
      res.json({ message: response });
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
