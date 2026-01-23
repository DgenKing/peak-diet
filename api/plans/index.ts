import { VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { authenticate, AuthRequest } from '../lib/auth';

export default async function handler(req: AuthRequest, res: VercelResponse) {
  const auth = await authenticate(req, res);
  if (!auth) return;

  const { userId } = auth;

  if (req.method === 'GET') {
    try {
      const { rows } = await db.query(
        'SELECT * FROM saved_plans WHERE user_id = $1 ORDER BY is_favorite DESC, updated_at DESC',
        [userId]
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching plans:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    const { name, plan_data, is_favorite } = req.body;

    if (!name || !plan_data) {
      return res.status(400).json({ error: 'Name and plan_data are required' });
    }

    try {
      const { rows } = await db.query(
        'INSERT INTO saved_plans (user_id, name, plan_data, is_favorite) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, name, JSON.stringify(plan_data), is_favorite || false]
      );
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error saving plan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
