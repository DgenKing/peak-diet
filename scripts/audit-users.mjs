#!/usr/bin/env node
/**
 * Audit Users - Detailed view of all user data issues
 */

import pg from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });
config();

const { Pool } = pg;
const db = new Pool({ connectionString: process.env.POSTGRES_URL });

async function audit() {
  console.log('========================================');
  console.log('USER AUDIT REPORT');
  console.log('========================================\n');

  try {
    // Get all non-anonymous users
    const { rows: users } = await db.query(`
      SELECT
        id,
        device_id,
        email,
        username,
        is_anonymous,
        neon_user_id,
        migration_status,
        password_hash IS NOT NULL as has_password,
        created_at
      FROM users
      WHERE is_anonymous = false OR email IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 20;
    `);

    console.log(`Found ${users.length} registered/email users:\n`);

    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.username || 'NO_USERNAME'} (${u.email || 'NO_EMAIL'})`);
      console.log(`   DB ID:      ${u.id}`);
      console.log(`   Neon ID:    ${u.neon_user_id || 'MISSING'}`);
      console.log(`   Device ID:  ${u.device_id || 'MISSING'}`);
      console.log(`   Has PW:     ${u.has_password ? 'Yes' : 'No'}`);
      console.log(`   Status:     ${u.migration_status || 'N/A'}`);
      console.log(`   Created:    ${u.created_at}`);

      // Flag issues
      const issues = [];
      if (!u.email) issues.push('NO EMAIL');
      if (!u.device_id) issues.push('NO DEVICE_ID');
      if (!u.neon_user_id && !u.is_anonymous) issues.push('NO NEON_ID');

      if (issues.length > 0) {
        console.log(`   ⚠️  ISSUES: ${issues.join(', ')}`);
      }
      console.log('');
    });

    // Summary of problems
    const { rows: problems } = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE device_id IS NULL AND is_anonymous = false) as missing_device_id,
        COUNT(*) FILTER (WHERE email IS NULL AND is_anonymous = false) as missing_email,
        COUNT(*) FILTER (WHERE neon_user_id IS NULL AND is_anonymous = false AND email IS NOT NULL) as missing_neon_id
      FROM users;
    `);

    console.log('========================================');
    console.log('PROBLEM SUMMARY:');
    console.log('========================================');
    console.log(`Missing device_id: ${problems[0].missing_device_id}`);
    console.log(`Missing email: ${problems[0].missing_email}`);
    console.log(`Missing neon_user_id: ${problems[0].missing_neon_id}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

audit();
