-- Add device_id column to token_usage table for cross-session tracking
-- This allows token limits to persist across login/logout on same device

ALTER TABLE token_usage ADD COLUMN IF NOT EXISTS device_id VARCHAR(255);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_usage_device_id ON token_usage(device_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_device_date ON token_usage(device_id, created_at);

-- Verify the changes
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'token_usage';
