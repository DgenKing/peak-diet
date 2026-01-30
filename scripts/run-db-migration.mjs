#!/usr/bin/env node
/**
 * Run Database Migration
 *
 * Executes the SQL migration to add tracking columns
 */

import pg from 'pg';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
config({ path: '.env.local' });
config();

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function runMigration() {
  console.log('========================================');
  console.log('Running Database Migration');
  console.log('========================================\n');

  try {
    // Read migration SQL file
    const migrationSQL = readFileSync('migrations/001_add_migration_columns.sql', 'utf8');

    console.log('Migration SQL:');
    console.log('-------------');
    console.log(migrationSQL);
    console.log('\n');

    // Execute migration
    console.log('Executing migration...\n');
    await db.query(migrationSQL);

    console.log('✓ Migration completed successfully!\n');

    // Verify columns were added
    const { rows } = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
        AND column_name IN ('neon_user_id', 'migration_status', 'migrated_at')
      ORDER BY column_name;
    `);

    console.log('Verification:');
    console.log('------------');
    rows.forEach(row => {
      console.log(`✓ ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
    });

    console.log('\n========================================');
    console.log('✓ Migration complete!');
    console.log('   Next step: Run check-db-state.mjs to verify');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\n⚠️  Columns may already exist. Run check-db-state.mjs to verify.');
    }

    process.exit(1);
  } finally {
    await db.end();
  }
}

// Check for POSTGRES_URL
if (!process.env.POSTGRES_URL) {
  console.error('❌ Error: POSTGRES_URL environment variable not set');
  console.error('   Make sure .env.local contains POSTGRES_URL');
  process.exit(1);
}

// Run migration
runMigration().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
