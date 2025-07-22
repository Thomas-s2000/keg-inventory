import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const beerTypes = pgTable("beer_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  kegCount: integer("keg_count").notNull().default(0),
});

export const insertBeerTypeSchema = createInsertSchema(beerTypes).pick({
  name: true,
  kegCount: true,
});

export const updateKegCountSchema = z.object({
  id: z.number(),
  amount: z.number().min(1),
});

export type InsertBeerType = z.infer<typeof insertBeerTypeSchema>;
export type BeerType = typeof beerTypes.$inferSelect;
export type UpdateKegCount = z.infer<typeof updateKegCountSchema>;

// Keep existing user schema for compatibility
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
