import { VercelResponse } from '@vercel/node';
import { db } from '../lib/db.js';
import { authenticate, AuthRequest } from '../lib/auth.js';

export default async function handler(req: AuthRequest, res: VercelResponse) {
  const auth = await authenticate(req, res);
  if (!auth) return;

  const { userId } = auth;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Schedule ID is required' });
  }

  // GET - Get single schedule
  if (req.method === 'GET') {
    try {
      const { rows } = await db.query(
        'SELECT * FROM weekly_schedules WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PATCH - Update schedule
  if (req.method === 'PATCH') {
    const { name, schedule_data, is_active } = req.body;

    try {
      // If setting as active, deactivate others first
      if (is_active) {
        await db.query(
          'UPDATE weekly_schedules SET is_active = false WHERE user_id = $1',
          [userId]
        );
      }

      const updates: string[] = [];
      const values: (string | boolean)[] = [];
      let paramCount = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramCount++}`);
        values.push(name);
      }
      if (schedule_data !== undefined) {
        updates.push(`schedule_data = $${paramCount++}`);
        values.push(JSON.stringify(schedule_data));
      }
      if (is_active !== undefined) {
        updates.push(`is_active = $${paramCount++}`);
        values.push(is_active);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id, userId);

      const { rows } = await db.query(
        `UPDATE weekly_schedules SET ${updates.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`,
        values
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error updating schedule:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE - Delete schedule
  if (req.method === 'DELETE') {
    try {
      const { rowCount } = await db.query(
        'DELETE FROM weekly_schedules WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (rowCount === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      return res.status(200).json({ message: 'Schedule deleted' });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
