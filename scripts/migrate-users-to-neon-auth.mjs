#!/usr/bin/env node
/**
 * Bulk Migration Script: Old JWT Auth → Neon Auth
 *
 * This script migrates all existing users from the old JWT authentication
 * system to Neon Auth by:
 * 1. Creating accounts in Neon Auth with temporary passwords
 * 2. Triggering password reset emails for all users
 * 3. Linking old user records to new Neon Auth IDs
 * 4. Preserving all user data (schedules, plans, token usage)
 *
 * Usage:
 *   node scripts/migrate-users-to-neon-auth.mjs
 *
 * Requirements:
 *   - VITE_NEON_AUTH_URL environment variable
 *   - POSTGRES_URL environment variable
 *   - Database already has migration columns (run 001_add_migration_columns.sql first)
 */

import { createAuthClient } from '@neondatabase/neon-js/auth';
import pg from 'pg';
import * as crypto from 'crypto';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config();

const { Pool } = pg;

// Initialize Neon Auth client
const authClient = createAuthClient(process.env.VITE_NEON_AUTH_URL);

// Initialize database connection
const db = new Pool({
  connectionString: process.env.POSTGRES_URL
});

/**
 * Main migration function
 */
async function migrateUsers() {
  console.log('========================================');
  console.log('User Migration: JWT Auth → Neon Auth');
  console.log('========================================\n');

  try {
    // Fetch all users with emails and passwords (not anonymous, not already migrated)
    const { rows: users } = await db.query(`
      SELECT id, email, username, created_at
      FROM users
      WHERE email IS NOT NULL
        AND password_hash IS NOT NULL
        AND (neon_user_id IS NULL OR migration_status = 'failed')
      ORDER BY created_at ASC
    `);

    console.log(`Found ${users.length} users to migrate\n`);

    if (users.length === 0) {
      console.log('✓ No users need migration. All done!');
      return;
    }

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;
    const errors = [];

    for (const [index, user] of users.entries()) {
      const progress = `[${index + 1}/${users.length}]`;

      try {
        console.log(`${progress} Migrating ${user.email}...`);

        // Generate a random temporary password
        const tempPassword = crypto.randomUUID();

        // Create user in Neon Auth
        const result = await authClient.signUp.email({
          email: user.email,
          password: tempPassword,
          name: user.username,
          callbackURL: 'https://peak-diet.vercel.app'
        });

        if (result.error) {
          // Check if user already exists in Neon Auth
          if (result.error.message?.includes('already exists') ||
              result.error.message?.includes('duplicate')) {
            console.log(`${progress} ⚠ ${user.email} already exists in Neon Auth - skipping`);
            skipCount++;

            // Mark as migrated anyway (manually created)
            await db.query(`
              UPDATE users
              SET migration_status = 'manual'
              WHERE id = $1
            `, [user.id]);

            continue;
          }

          throw new Error(result.error.message);
        }

        const neonUserId = result.data.user.id;

        // Update old record with Neon user ID
        await db.query(`
          UPDATE users
          SET neon_user_id = $1,
              migration_status = 'migrated',
              migrated_at = NOW()
          WHERE id = $2
        `, [neonUserId, user.id]);

        // Trigger password reset email
        const resetResult = await authClient.emailOtp.sendVerificationOtp({
          email: user.email,
          type: 'forget-password'
        });

        if (resetResult.error) {
          console.log(`${progress} ⚠ User created but password reset email failed: ${resetResult.error.message}`);
        }

        console.log(`${progress} ✓ Migrated ${user.email} (Neon ID: ${neonUserId})`);
        successCount++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        console.error(`${progress} ✗ Failed to migrate ${user.email}: ${err.message}`);
        failCount++;
        errors.push({ email: user.email, error: err.message });

        // Mark as failed in database
        try {
          await db.query(`
            UPDATE users
            SET migration_status = 'failed'
            WHERE id = $1
          `, [user.id]);
        } catch (dbErr) {
          console.error(`${progress} ✗ Failed to update migration status: ${dbErr.message}`);
        }
      }
    }

    console.log(`\n========================================`);
    console.log('         MIGRATION COMPLETE');
    console.log('========================================');
    console.log(`✓ Success:        ${successCount} users`);
    console.log(`⚠ Skipped:        ${skipCount} users (already in Neon Auth)`);
    console.log(`✗ Failed:         ${failCount} users`);
    console.log(`📊 Total:          ${users.length} users`);
    console.log('========================================\n');

    if (errors.length > 0) {
      console.log('Failed Migrations:');
      console.log('------------------');
      errors.forEach(({ email, error }) => {
        console.log(`  • ${email}`);
        console.log(`    ${error}`);
      });
      console.log('');
    }

    if (successCount > 0) {
      console.log('📧 Next Steps:');
      console.log('  1. Migrated users will receive password reset emails');
      console.log('  2. Users must reset their password to access their account');
      console.log('  3. All user data (schedules, plans) will be preserved');
      console.log('  4. Check migration status: GET /api/migration/status\n');
    }

  } catch (error) {
    console.error('\n❌ Migration script failed:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await db.end();
  }
}

// Check for required environment variables
if (!process.env.VITE_NEON_AUTH_URL) {
  console.error('❌ Error: VITE_NEON_AUTH_URL environment variable is not set');
  process.exit(1);
}

if (!process.env.POSTGRES_URL) {
  console.error('❌ Error: POSTGRES_URL environment variable is not set');
  process.exit(1);
}

// Run migration
migrateUsers().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
