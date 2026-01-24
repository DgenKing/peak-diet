import { db } from './db.js';

interface TokenUsageParams {
  userId: string;
  tokensInput: number;
  tokensOutput: number;
  model: string;
  requestType: 'generate' | 'update' | 'meal_update' | 'shopping_list';
}

export async function recordTokenUsage({
  userId,
  tokensInput,
  tokensOutput,
  model,
  requestType
}: TokenUsageParams): Promise<void> {
  try {
    console.log(`Recording token usage for user ${userId}, type: ${requestType}`);
    const result = await db.query(
      `INSERT INTO token_usage (user_id, tokens_input, tokens_output, model, request_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, tokensInput, tokensOutput, model, requestType]
    );
    console.log(`Successfully recorded token usage. Entry ID: ${result.rows[0]?.id}`);
  } catch (error) {
    // Log but don't fail the request if tracking fails
    console.error('Failed to record token usage:', error);
  }
}