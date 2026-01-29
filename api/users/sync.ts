import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, email, username } = req.body;

  if (!user_id || !email || !username) {
    return res.status(400).json({ error: 'user_id, email, and username are required' });
  }

  try {
    // Check if user already exists in custom table
    const { rows: existing } = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [user_id]
    );

    if (existing.length > 0) {
      // User exists, update their info
      const result = await db.query(
        `UPDATE users
         SET email = $2, username = $3, is_anonymous = false
         WHERE id = $1
         RETURNING *`,
        [user_id, email, username]
      );
      return res.status(200).json(result.rows[0]);
    }

    // Create new user in custom table
    const result = await db.query(
      `INSERT INTO users (id, email, username, is_anonymous)
       VALUES ($1, $2, $3, false)
       ON CONFLICT (id) DO UPDATE
       SET email = $2, username = $3, is_anonymous = false
       RETURNING *`,
      [user_id, email, username]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error syncing user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
