import { beerTypes, type BeerType, type InsertBeerType, type UpdateKegCount } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Beer type operations
  getAllBeerTypes(): Promise<BeerType[]>;
  getBeerType(id: number): Promise<BeerType | undefined>;
  createBeerType(beerType: InsertBeerType): Promise<BeerType>;
  deleteBeerType(id: number): Promise<void>;
  updateKegCount(id: number, newCount: number): Promise<BeerType>;
  
  // Keep existing user operations for compatibility
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getAllBeerTypes(): Promise<BeerType[]> {
    return await db.select().from(beerTypes).orderBy(beerTypes.name);
  }

  async getBeerType(id: number): Promise<BeerType | undefined> {
    const [beerType] = await db.select().from(beerTypes).where(eq(beerTypes.id, id));
    return beerType || undefined;
  }

  async createBeerType(insertBeerType: InsertBeerType): Promise<BeerType> {
    const [beerType] = await db
      .insert(beerTypes)
      .values(insertBeerType)
      .returning();
    return beerType;
  }

  async deleteBeerType(id: number): Promise<void> {
    await db.delete(beerTypes).where(eq(beerTypes.id, id));
  }

  async updateKegCount(id: number, newCount: number): Promise<BeerType> {
    const [beerType] = await db
      .update(beerTypes)
      .set({ kegCount: newCount })
      .where(eq(beerTypes.id, id))
      .returning();
    return beerType;
  }

  // Keep existing user methods as stubs for compatibility
  async getUser(id: number): Promise<any> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any> {
    return undefined;
  }

  async createUser(user: any): Promise<any> {
    return user;
  }
}

export const storage = new DatabaseStorage();
