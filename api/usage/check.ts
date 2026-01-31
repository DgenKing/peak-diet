import { VercelRequest, VercelResponse } from '@vercel/node';
import { checkDailyLimit } from '../lib/token.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, deviceId } = req.body;

  if (!userId && !deviceId) {
    return res.status(400).json({ error: 'userId or deviceId required' });
  }

  const limitCheck = await checkDailyLimit(userId, deviceId);

  return res.status(200).json({
    allowed: limitCheck.allowed,
    used: limitCheck.used,
    limit: limitCheck.limit,
    remaining: limitCheck.remaining,
  });
}
