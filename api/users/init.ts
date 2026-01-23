import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { generateFitnessUsername } from '../lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { device_id } = req.body;

  if (!device_id) {
    return res.status(400).json({ error: 'device_id is required' });
  }

  try {
    // Check if user exists
    const { rows } = await db.query('SELECT * FROM users WHERE device_id = $1', [device_id]);

    if (rows.length > 0) {
      return res.status(200).json(rows[0]);
    }

    // Create new anonymous user
    const username = generateFitnessUsername();
    const result = await db.query(
      'INSERT INTO users (device_id, username, is_anonymous) VALUES ($1, $2, true) RETURNING *',
      [device_id, username]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error in /api/users/init:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
