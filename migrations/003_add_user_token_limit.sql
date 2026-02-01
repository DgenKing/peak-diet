-- Add daily_token_limit column to users table
-- Default is 5000 tokens per day
-- To give a user higher limit, update their daily_token_limit value in the database

ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_token_limit INT DEFAULT 5000;

-- Example: To give a specific user 50,000 tokens/day:
-- UPDATE users SET daily_token_limit = 50000 WHERE email = 'vip@example.com';
