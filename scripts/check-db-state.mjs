#!/usr/bin/env node
/**
 * Check Database State
 *
 * Checks if migration columns exist in the users table
 */

import pg from 'pg';
import { config } from 'dotenv';

// Load environment variables from .env.local first, then .env
config({ path: '.env.local' });
config();

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function checkDatabaseState() {
  console.log('========================================');
  console.log('Database State Check');
  console.log('========================================\n');

  try {
    // Check if migration columns exist
    const { rows } = await db.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
        AND column_name IN ('neon_user_id', 'migration_status', 'migrated_at')
      ORDER BY column_name;
    `);

    console.log('Migration Columns Status:');
    console.log('-------------------------');

    const expectedColumns = ['migrated_at', 'migration_status', 'neon_user_id'];
    const existingColumns = rows.map(r => r.column_name);

    expectedColumns.forEach(col => {
      const exists = existingColumns.includes(col);
      const status = exists ? '✓ EXISTS' : '✗ MISSING';
      console.log(`${status}: ${col}`);

      if (exists) {
        const row = rows.find(r => r.column_name === col);
        console.log(`           Type: ${row.data_type}`);
      }
    });

    console.log('\n');

    // Check user counts (only if migration columns exist)
    let userCounts;
    if (existingColumns.length === 3) {
      const { rows } = await db.query(`
        SELECT
          COUNT(*) as total_users,
          COUNT(email) as users_with_email,
          COUNT(password_hash) as users_with_password,
          COUNT(neon_user_id) as users_with_neon_id,
          COUNT(CASE WHEN email IS NOT NULL AND neon_user_id IS NULL THEN 1 END) as needs_migration
        FROM users;
      `);
      userCounts = rows;
    } else {
      // Fallback query without migration columns
      const { rows } = await db.query(`
        SELECT
          COUNT(*) as total_users,
          COUNT(email) as users_with_email,
          COUNT(password_hash) as users_with_password
        FROM users;
      `);
      userCounts = [{ ...rows[0], users_with_neon_id: 0, needs_migration: rows[0].users_with_password }];
    }

    console.log('User Statistics:');
    console.log('----------------');
    console.log(`Total users: ${userCounts[0].total_users}`);
    console.log(`Users with email: ${userCounts[0].users_with_email}`);
    console.log(`Users with password: ${userCounts[0].users_with_password}`);
    console.log(`Users with Neon ID: ${userCounts[0].users_with_neon_id}`);
    console.log(`Users needing migration: ${userCounts[0].needs_migration}`);

    console.log('\n========================================');

    if (existingColumns.length === 0) {
      console.log('❌ Migration columns DO NOT exist');
      console.log('   Next step: Run database migration SQL');
    } else if (existingColumns.length < 3) {
      console.log('⚠️  Migration columns PARTIALLY exist');
      console.log('   Next step: Complete database migration SQL');
    } else {
      console.log('✓ Migration columns exist');
      if (parseInt(userCounts[0].needs_migration) > 0) {
        console.log('   Next step: Run user migration script');
      } else {
        console.log('   Next step: All users migrated!');
      }
    }
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('\nPossible causes:');
    console.error('- POSTGRES_URL environment variable not set');
    console.error('- Database connection failed');
    console.error('- Users table does not exist');
    process.exit(1);
  } finally {
    await db.end();
  }
}

// Run check
checkDatabaseState().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
