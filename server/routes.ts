import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBeerTypeSchema, updateKegCountSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all beer types
  app.get("/api/beer-types", async (req, res) => {
    try {
      console.log("Attempting to fetch beer types...");
      const beerTypes = await storage.getAllBeerTypes();
      console.log(`Successfully fetched ${beerTypes.length} beer types`);
      res.json(beerTypes);
    } catch (error) {
      console.error("Error fetching beer types:", error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      res.status(500).json({ 
        message: "Failed to fetch beer types", 
        error: error instanceof Error ? error.message : 'Database connection error'
      });
    }
  });

  // Create new beer type
  app.post("/api/beer-types", async (req, res) => {
    try {
      const validatedData = insertBeerTypeSchema.parse(req.body);
      const beerType = await storage.createBeerType(validatedData);
      res.status(201).json(beerType);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("unique")) {
        res.status(409).json({ message: "Beer type with this name already exists" });
      } else {
        console.error("Error creating beer type:", error);
        res.status(500).json({ message: "Failed to create beer type" });
      }
    }
  });

  // Delete beer type
  app.delete("/api/beer-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid beer type ID" });
      }

      const beerType = await storage.getBeerType(id);
      if (!beerType) {
        return res.status(404).json({ message: "Beer type not found" });
      }

      await storage.deleteBeerType(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting beer type:", error);
      res.status(500).json({ message: "Failed to delete beer type" });
    }
  });

  // Add kegs to beer type
  app.post("/api/beer-types/:id/add-kegs", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid beer type ID" });
      }

      const { amount } = updateKegCountSchema.omit({ id: true }).parse(req.body);
      
      const beerType = await storage.getBeerType(id);
      if (!beerType) {
        return res.status(404).json({ message: "Beer type not found" });
      }

      const newCount = beerType.kegCount + amount;
      const updatedBeerType = await storage.updateKegCount(id, newCount);
      res.json(updatedBeerType);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        console.error("Error adding kegs:", error);
        res.status(500).json({ message: "Failed to add kegs" });
      }
    }
  });

  // Remove kegs from beer type
  app.post("/api/beer-types/:id/remove-kegs", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid beer type ID" });
      }

      const { amount } = updateKegCountSchema.omit({ id: true }).parse(req.body);
      
      const beerType = await storage.getBeerType(id);
      if (!beerType) {
        return res.status(404).json({ message: "Beer type not found" });
      }

      const newCount = beerType.kegCount - amount;
      if (newCount < 0) {
        return res.status(400).json({ message: "Cannot remove more kegs than available in stock" });
      }

      const updatedBeerType = await storage.updateKegCount(id, newCount);
      res.json(updatedBeerType);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        console.error("Error removing kegs:", error);
        res.status(500).json({ message: "Failed to remove kegs" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
