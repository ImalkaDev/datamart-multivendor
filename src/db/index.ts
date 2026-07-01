import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Provide a dummy connection string for build time if undefined
// so Next.js static generation doesn't crash
const connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy";
const sql = neon(connectionString);

export const db = drizzle({ client: sql, schema });
