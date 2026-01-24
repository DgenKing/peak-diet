import { VercelResponse } from '@vercel/node';
import { db } from './lib/db.js';
import { authenticate, AuthRequest } from './lib/auth.js';

export default async function handler(req: AuthRequest, res: VercelResponse) {
  const auth = await authenticate(req, res);
  if (!auth) return;

  const { userId } = auth;

  // GET - List all plans
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

  // POST - Create new plan
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

  // PATCH - Update plan
  if (req.method === 'PATCH') {
    const { id, name, plan_data, is_favorite } = req.body;
    if (!id) return res.status(400).json({ error: 'Plan ID is required' });

    try {
      const updates = [];
      const values = [];
      let i = 1;

      if (name !== undefined) { updates.push(`name = $${i++}`); values.push(name); }
      if (plan_data !== undefined) { updates.push(`plan_data = $${i++}`); values.push(JSON.stringify(plan_data)); }
      if (is_favorite !== undefined) { updates.push(`is_favorite = $${i++}`); values.push(is_favorite); }

      if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

      values.push(id, userId);
      const { rows } = await db.query(
        `UPDATE saved_plans SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
        values
      );

      if (rows.length === 0) return res.status(404).json({ error: 'Plan not found' });
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error updating plan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE - Delete plan
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Plan ID is required' });

    try {
      const { rowCount } = await db.query(
        'DELETE FROM saved_plans WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      if (rowCount === 0) return res.status(404).json({ error: 'Plan not found' });
      return res.status(200).json({ message: 'Plan deleted' });
    } catch (error) {
      console.error('Error deleting plan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}