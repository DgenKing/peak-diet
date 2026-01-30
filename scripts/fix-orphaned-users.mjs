#!/usr/bin/env node
/**
 * Fix Orphaned Users
 *
 * Finds users in custom table with missing data and shows the state
 */

import pg from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });
config();

const { Pool } = pg;
const db = new Pool({ connectionString: process.env.POSTGRES_URL });

async function checkUsers() {
  console.log('========================================');
  console.log('Database User State Check');
  console.log('========================================\n');

  try {
    // Check all registered users (non-anonymous)
    const { rows: registeredUsers } = await db.query(`
      SELECT id, device_id, email, username, is_anonymous, neon_user_id, migration_status, created_at
      FROM users
      WHERE is_anonymous = false OR email IS NOT NULL
      ORDER BY created_at DESC;
    `);

    console.log(`Found ${registeredUsers.length} registered users:\n`);

    registeredUsers.forEach((u, i) => {
      const hasEmail = u.email ? '✓' : '✗';
      const hasDeviceId = u.device_id ? '✓' : '✗';
      const hasNeonId = u.neon_user_id ? '✓' : '✗';

      console.log(`${i + 1}. ${u.username || 'No username'}`);
      console.log(`   ID: ${u.id}`);
      console.log(`   Email: ${hasEmail} ${u.email || 'MISSING'}`);
      console.log(`   Device ID: ${hasDeviceId} ${u.device_id ? u.device_id.substring(0, 20) + '...' : 'MISSING'}`);
      console.log(`   Neon ID: ${hasNeonId} ${u.neon_user_id ? u.neon_user_id.substring(0, 20) + '...' : 'MISSING'}`);
      console.log(`   Status: ${u.migration_status || 'N/A'}`);
      console.log('');
    });

    // Find problematic users
    const { rows: problemUsers } = await db.query(`
      SELECT id, email, username, device_id, neon_user_id
      FROM users
      WHERE (is_anonymous = false OR email IS NOT NULL)
        AND (device_id IS NULL OR email IS NULL OR neon_user_id IS NULL);
    `);

    if (problemUsers.length > 0) {
      console.log('========================================');
      console.log('⚠️  PROBLEM USERS (missing data):');
      console.log('========================================');
      problemUsers.forEach(u => {
        console.log(`- ${u.username}: email=${u.email || 'NULL'}, device_id=${u.device_id ? 'SET' : 'NULL'}, neon_id=${u.neon_user_id ? 'SET' : 'NULL'}`);
      });
    } else {
      console.log('✓ All registered users have complete data');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

checkUsers();
