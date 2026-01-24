import { createPool } from '@vercel/postgres';

// Fallback for local development (vercel dev doesn't pass env vars to serverless functions)
const CONNECTION_STRING = process.env.POSTGRES_URL
  || process.env.DATABASE_URL
  || "postgresql://neondb_owner:npg_zNpPtJqT4b2i@ep-dark-hat-abjc7p03-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require";

export const db = createPool({ connectionString: CONNECTION_STRING });
