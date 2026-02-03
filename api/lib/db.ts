import { createPool } from '@vercel/postgres';

const CONNECTION_STRING = process.env.POSTGRES_URL || process.env.DATABASE_URL;

export const db = createPool({ connectionString: CONNECTION_STRING });
