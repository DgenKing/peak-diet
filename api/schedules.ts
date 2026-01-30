import { VercelResponse } from '@vercel/node';
import { db } from './lib/db.js';
import { authenticate, AuthRequest } from './lib/auth.js';

export default async function handler(req: AuthRequest, res: VercelResponse) {
  const auth = await authenticate(req, res);
  if (!auth) return;

  const { userId } = auth;

  // GET - Get all schedules for user
  if (req.method === 'GET') {
    try {
      const { rows } = await db.query(
        'SELECT * FROM weekly_schedules WHERE user_id = $1 ORDER BY is_active DESC, updated_at DESC',
        [userId]
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST - Create or update schedule (UPSERT)
  if (req.method === 'POST') {
    const { name, schedule_data, is_active } = req.body;

    if (!name || !schedule_data) {
      return res.status(400).json({ error: 'Name and schedule_data are required' });
    }

    try {
      // Delete existing schedule with same name for this user (UPSERT behavior)
      await db.query(
        'DELETE FROM weekly_schedules WHERE user_id = $1 AND name = $2',
        [userId, name]
      );

      // If setting as active, deactivate others first
      if (is_active) {
        await db.query(
          'UPDATE weekly_schedules SET is_active = false WHERE user_id = $1',
          [userId]
        );
      }

      const { rows } = await db.query(
        'INSERT INTO weekly_schedules (user_id, name, schedule_data, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, name, JSON.stringify(schedule_data), is_active || false]
      );
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error creating schedule:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown',
        code: (error as any)?.code,
        userId,
        name
      });
      return res.status(500).json({
        error: 'Failed to save schedule',
        details: error instanceof Error ? error.message : 'Database connection error'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
