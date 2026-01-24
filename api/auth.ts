import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

// Helper to parse cookies from headers
function parseCookies(req: VercelRequest) {
  const list: Record<string, string> = {};
  const rc = req.headers.cookie;

  rc && rc.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift()!.trim()] = decodeURI(parts.join('='));
  });

  return list;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Use action from body for POST, from query for GET
  const action = req.method === 'POST' ? req.body.action : req.query.action;

  if (req.method === 'POST') {
    if (action === 'login') {
      return handleLogin(req, res);
    } else if (action === 'register') {
      return handleRegister(req, res);
    } else if (action === 'logout') {
      return handleLogout(req, res);
    }
  } else if (req.method === 'GET') {
    if (action === 'me') {
      return handleMe(req, res);
    }
  }

  return res.status(405).json({ error: 'Method not allowed or invalid action' });
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);

    const { password_hash, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error in handleLogin:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleRegister(req: VercelRequest, res: VercelResponse) {
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
      result = await db.query(
        `UPDATE users 
         SET email = $1, password_hash = $2, username = $3, is_anonymous = false, updated_at = CURRENT_TIMESTAMP 
         WHERE device_id = $4 
         RETURNING id, username, email, is_anonymous`,
        [email, hashedPassword, username, device_id]
      );

      if (result.rows.length === 0) {
        result = await db.query(
          'INSERT INTO users (email, password_hash, username, is_anonymous) VALUES ($1, $2, $3, false) RETURNING id, username, email, is_anonymous',
          [email, hashedPassword, username]
        );
      }
    } else {
      result = await db.query(
        'INSERT INTO users (email, password_hash, username, is_anonymous) VALUES ($1, $2, $3, false) RETURNING id, username, email, is_anonymous',
        [email, hashedPassword, username]
      );
    }

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error in handleRegister:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleLogout(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return res.status(200).json({ message: 'Logged out' });
}

async function handleMe(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req);
  const token = cookies.token || req.headers.authorization?.split(' ')[1];

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