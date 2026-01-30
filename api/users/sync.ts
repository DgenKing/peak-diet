import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, email, username, device_id } = req.body;

  if (!user_id || !email || !username) {
    return res.status(400).json({ error: 'user_id, email, and username are required' });
  }

  try {
    // ANONYMOUS USER UPGRADE: Check if there's an existing anonymous user with this device_id
    // This preserves their meal plans when they register
    if (device_id) {
      const { rows: anonUser } = await db.query(
        `SELECT * FROM users WHERE device_id = $1 AND is_anonymous = true`,
        [device_id]
      );

      if (anonUser.length > 0) {
        // Upgrade anonymous user to registered user
        const result = await db.query(
          `UPDATE users
           SET email = $2, username = $3, is_anonymous = false, neon_user_id = $1, migration_status = 'upgraded'
           WHERE device_id = $4 AND is_anonymous = true
           RETURNING *`,
          [user_id, email, username, device_id]
        );
        console.log('Upgraded anonymous user to registered:', result.rows[0]?.id);
        return res.status(200).json({
          ...result.rows[0],
          upgraded: true,
          message: 'Anonymous user upgraded to registered'
        });
      }
    }

    // MIGRATION LOGIC: Check if an old user with this email exists
    // If they do, link them to the new Neon Auth user ID
    const { rows: oldUser } = await db.query(
      `SELECT id FROM users
       WHERE email = $1
         AND neon_user_id IS NULL
         AND password_hash IS NOT NULL`,
      [email]
    );

    if (oldUser.length > 0) {
      // This is a migrated user - update their old record with Neon Auth ID
      const result = await db.query(
        `UPDATE users
         SET neon_user_id = $1,
             migration_status = 'migrated',
             migrated_at = NOW()
         WHERE id = $2
         RETURNING id, email, username, neon_user_id, migration_status`,
        [user_id, oldUser[0].id]
      );

      return res.status(200).json({
        ...result.rows[0],
        migrated: true,
        old_user_id: oldUser[0].id,
        message: 'Existing user linked to Neon Auth'
      });
    }

    // Check if user already exists by neon_user_id
    const { rows: existingByNeonId } = await db.query(
      'SELECT * FROM users WHERE neon_user_id = $1',
      [user_id]
    );

    if (existingByNeonId.length > 0) {
      // User found by neon_user_id - update their info
      const result = await db.query(
        `UPDATE users
         SET email = $2, username = $3, is_anonymous = false
         WHERE neon_user_id = $1
         RETURNING *`,
        [user_id, email, username]
      );
      return res.status(200).json(result.rows[0]);
    }

    // Check if user exists where id matches neon_user_id (new users)
    try {
      const { rows: existingById } = await db.query(
        'SELECT * FROM users WHERE id = $1::uuid',
        [user_id]
      );

      if (existingById.length > 0) {
        // User found by id - update and link neon_user_id
        const result = await db.query(
          `UPDATE users
           SET email = $2, username = $3, is_anonymous = false, neon_user_id = $1
           WHERE id = $1::uuid
           RETURNING *`,
          [user_id, email, username]
        );
        return res.status(200).json(result.rows[0]);
      }
    } catch (e) {
      // UUID cast failed - that's ok, just means it's not a valid UUID format
    }

    // Check if user exists by email (fallback for when neon_user_id wasn't set)
    const { rows: existingByEmail } = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingByEmail.length > 0) {
      // User found by email - update and link neon_user_id
      const result = await db.query(
        `UPDATE users
         SET username = $3, is_anonymous = false, neon_user_id = $1
         WHERE email = $2
         RETURNING *`,
        [user_id, email, username]
      );
      console.log('Linked existing user by email:', result.rows[0]?.id);
      return res.status(200).json(result.rows[0]);
    }

    // Create new user in custom table (new registration)
    // Generate device_id for new Neon Auth users (use their user_id as device_id)
    const result = await db.query(
      `INSERT INTO users (id, device_id, email, username, is_anonymous, neon_user_id, migration_status)
       VALUES ($1::uuid, $1::text, $2, $3, false, $1::text, 'new')
       ON CONFLICT (id) DO UPDATE
       SET email = $2, username = $3, is_anonymous = false, neon_user_id = $1::text
       RETURNING *`,
      [user_id, email, username]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error syncing user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
