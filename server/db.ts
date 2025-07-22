import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { readFileSync } from 'fs';
import { join } from 'path';

// Charger les variables d'environnement depuis .env sans dépendance externe
try {
  const envPath = join(process.cwd(), '.env');
  const envFile = readFileSync(envPath, 'utf8');
  const envVars = envFile.split('\n').filter(line => line.includes('='));
  
  envVars.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (error) {
  console.warn('Fichier .env non trouvé ou illisible, utilisation des variables d\'environnement système');
}

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });