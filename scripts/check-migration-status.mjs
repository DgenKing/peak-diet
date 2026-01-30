#!/usr/bin/env node
/**
 * Check Migration Status
 * Shows detailed migration status for all users
 */

import pg from 'pg';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config();

const { Pool } = pg;
const db = new Pool({ connectionString: process.env.POSTGRES_URL });

async function checkStatus() {
  console.log('========================================');
  console.log('Migration Status Report');
  console.log('========================================\n');

  try {
    // Get migration status breakdown
    const { rows } = await db.query(`
      SELECT
        migration_status,
        COUNT(*) as count
      FROM users
      WHERE email IS NOT NULL
        AND password_hash IS NOT NULL
      GROUP BY migration_status
      ORDER BY migration_status;
    `);

    console.log('Status Breakdown:');
    console.log('-----------------');
    let total = 0;
    rows.forEach(row => {
      console.log(`${row.migration_status}: ${row.count} users`);
      total += parseInt(row.count);
    });
    console.log(`\nTotal: ${total} users`);

    // Show all migrated users
    const { rows: users } = await db.query(`
      SELECT email, username, migration_status, migrated_at, neon_user_id IS NOT NULL as has_neon_id
      FROM users
      WHERE email IS NOT NULL
      ORDER BY migrated_at DESC NULLS LAST;
    `);

    console.log('\n========================================');
    console.log('All Users:');
    console.log('========================================');
    users.forEach(u => {
      const status = u.migration_status || 'pending';
      const neonId = u.has_neon_id ? '✓' : '✗';
      const date = u.migrated_at ? new Date(u.migrated_at).toLocaleString() : 'N/A';
      console.log(`${neonId} ${u.email.padEnd(35)} | ${status.padEnd(10)} | ${date}`);
    });

    console.log('\n========================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

checkStatus().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
