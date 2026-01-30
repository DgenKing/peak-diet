#!/usr/bin/env node
/**
 * Check Specific User
 */

import pg from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });
config();

const { Pool } = pg;
const db = new Pool({ connectionString: process.env.POSTGRES_URL });

const userId = process.argv[2] || 'a8e993da-fdbb-4dce-b760-35d26b3b9e0b';

async function checkUser() {
  console.log(`\nChecking user: ${userId}\n`);

  try {
    // Check by neon_user_id
    const { rows: byNeonId } = await db.query(
      `SELECT id, email, username, is_anonymous, neon_user_id, migration_status, created_at
       FROM users
       WHERE neon_user_id = $1::text`,
      [userId]
    );

    // Check by id
    const { rows: byId } = await db.query(
      `SELECT id, email, username, is_anonymous, neon_user_id, migration_status, created_at
       FROM users
       WHERE id = $1::uuid`,
      [userId]
    );

    console.log('Results by neon_user_id:', byNeonId.length > 0 ? byNeonId[0] : 'Not found');
    console.log('\nResults by id:', byId.length > 0 ? byId[0] : 'Not found');

    if (byNeonId.length === 0 && byId.length === 0) {
      console.log('\n❌ User not found in database');
      console.log('This means the sync endpoint never created this user record.');
      console.log('\nTo fix: User needs to log in again, sync should run automatically.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

checkUser();
