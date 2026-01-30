-- Migration: Add columns for Neon Auth migration tracking
-- Created: 2026-01-29
-- Purpose: Track migration of users from old JWT auth to Neon Auth

-- Add column to link old user records to Neon Auth user IDs
ALTER TABLE users
ADD COLUMN IF NOT EXISTS neon_user_id VARCHAR(255) UNIQUE;

-- Add column to track migration status
ALTER TABLE users
ADD COLUMN IF NOT EXISTS migration_status VARCHAR(50) DEFAULT 'pending';

-- Add timestamp for when migration completed
ALTER TABLE users
ADD COLUMN IF NOT EXISTS migrated_at TIMESTAMP;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_neon_user_id ON users(neon_user_id);
CREATE INDEX IF NOT EXISTS idx_users_migration_status ON users(migration_status);

-- Add comments for documentation
COMMENT ON COLUMN users.neon_user_id IS 'Links old user record to Neon Auth user ID';
COMMENT ON COLUMN users.migration_status IS 'Migration status: pending, migrated, or failed';
COMMENT ON COLUMN users.migrated_at IS 'Timestamp when user was migrated to Neon Auth';
