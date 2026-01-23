import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { rows } = await db.query('SELECT id, username, email, is_anonymous, created_at FROM users WHERE id = $1', [decoded.userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
