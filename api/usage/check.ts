import { VercelRequest, VercelResponse } from '@vercel/node';
import { checkDailyLimit } from '../lib/token.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  const limitCheck = await checkDailyLimit(userId);

  return res.status(200).json({
    allowed: limitCheck.allowed,
    used: limitCheck.used,
    limit: limitCheck.limit,
    remaining: limitCheck.remaining,
  });
}
