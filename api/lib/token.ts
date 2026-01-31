import { db } from './db.js';

const DAILY_TOKEN_LIMIT = 5000;

interface TokenUsageParams {
  userId: string;
  deviceId?: string;  // Track by device for cross-session limits
  tokensInput: number;
  tokensOutput: number;
  model: string;
  requestType: 'generate' | 'update' | 'meal_update' | 'shopping_list';
}

export async function recordTokenUsage({
  userId,
  deviceId,
  tokensInput,
  tokensOutput,
  model,
  requestType
}: TokenUsageParams): Promise<void> {
  try {
    console.log(`Recording token usage for user ${userId}, device ${deviceId || 'N/A'}, type: ${requestType}`);
    const result = await db.query(
      `INSERT INTO token_usage (user_id, device_id, tokens_input, tokens_output, model, request_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [userId, deviceId || null, tokensInput, tokensOutput, model, requestType]
    );
    console.log(`Successfully recorded token usage. Entry ID: ${result.rows[0]?.id}`);
  } catch (error) {
    // Log but don't fail the request if tracking fails
    console.error('Failed to record token usage:', error);
  }
}

export async function checkDailyLimit(userId: string, deviceId?: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
}> {
  try {
    // Check by device_id OR user_id to catch all usage from this device
    // This ensures token limits persist across login/logout on same device
    const result = await db.query(
      `SELECT COALESCE(SUM(tokens_total), 0)::int as daily_tokens
       FROM token_usage
       WHERE (device_id = $1 OR user_id = $2)
         AND created_at >= CURRENT_DATE`,
      [deviceId, userId]
    );

    const used = result.rows[0]?.daily_tokens || 0;
    const remaining = Math.max(0, DAILY_TOKEN_LIMIT - used);

    return {
      allowed: used < DAILY_TOKEN_LIMIT,
      used,
      limit: DAILY_TOKEN_LIMIT,
      remaining
    };
  } catch (error) {
    console.error('Failed to check daily limit:', error);
    // Fail open - allow request if check fails
    return { allowed: true, used: 0, limit: DAILY_TOKEN_LIMIT, remaining: DAILY_TOKEN_LIMIT };
  }
}