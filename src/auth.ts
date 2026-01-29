import { createAuthClient } from '@neondatabase/neon-js/auth';

// This pulls the URL from your .env file automatically
export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
