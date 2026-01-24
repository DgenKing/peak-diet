import { VercelResponse } from '@vercel/node';
import { db } from './lib/db.js';
import { authenticate, AuthRequest } from './lib/auth.js';

export default async function handler(req: AuthRequest, res: VercelResponse) {
  const auth = await authenticate(req, res);
  if (!auth) return;

  const { userId } = auth;

  if (req.method === 'GET') {
    try {
      // Get total usage
      const totalRes = await db.query(
        `SELECT 
          SUM(tokens_total) as total_tokens,
          COUNT(*) as total_requests
         FROM token_usage WHERE user_id = $1`,
        [userId]
      );

      // Get usage by type
      const typeRes = await db.query(
        `SELECT 
          request_type,
          SUM(tokens_total) as tokens,
          COUNT(*) as count
         FROM token_usage 
         WHERE user_id = $1 
         GROUP BY request_type`,
        [userId]
      );

      // Get last 7 days daily usage
      const dailyRes = await db.query(
        `SELECT 
          DATE(created_at) as date,
          SUM(tokens_total) as tokens
         FROM token_usage 
         WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '7 days'
         GROUP BY DATE(created_at)
         ORDER BY date DESC`,
        [userId]
      );

      return res.status(200).json({
        total: totalRes.rows[0],
        byType: typeRes.rows,
        daily: dailyRes.rows
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
