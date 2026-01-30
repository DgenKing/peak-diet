import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

/**
 * JWT Token Issuer for Neon Auth Users
 *
 * After user logs in with Neon Auth, call this endpoint to get a JWT token
 * for authenticating with legacy API endpoints (plans, schedules, etc)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Create JWT token for API authentication
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    // Set as HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = [
      `token=${token}`,
      'Path=/',
      'HttpOnly',
      `SameSite=${isProduction ? 'Strict' : 'Lax'}`,
      `Max-Age=${7 * 24 * 60 * 60}`,
    ];
    if (isProduction) {
      cookieOptions.push('Secure');
    }
    res.setHeader('Set-Cookie', cookieOptions.join('; '));

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error creating JWT:', error);
    return res.status(500).json({ error: 'Failed to create token' });
  }
}
