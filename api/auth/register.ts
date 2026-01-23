import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { device_id, email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if email already exists
    const emailCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let result;
    if (device_id) {
      // Upgrade anonymous user
      result = await db.query(
        `UPDATE users 
         SET email = $1, password_hash = $2, username = $3, is_anonymous = false, updated_at = CURRENT_TIMESTAMP 
         WHERE device_id = $4 
         RETURNING id, username, email, is_anonymous`,
        [email, hashedPassword, username, device_id]
      );

      if (result.rows.length === 0) {
        // Fallback: create new if device_id not found for some reason
        result = await db.query(
          'INSERT INTO users (email, password_hash, username, is_anonymous) VALUES ($1, $2, $3, false) RETURNING id, username, email, is_anonymous',
          [email, hashedPassword, username]
        );
      }
    } else {
      // Create new registered user
      result = await db.query(
        'INSERT INTO users (email, password_hash, username, is_anonymous) VALUES ($1, $2, $3, false) RETURNING id, username, email, is_anonymous',
        [email, hashedPassword, username]
      );
    }

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
