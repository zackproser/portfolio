import { sql } from "@vercel/postgres";

async function getUserIdFromEmail(email: string): Promise<number | null> {
  // Implement logic to fetch user ID from the database based on email
  // Return the user ID or null if not found
  const userRes = await sql`SELECT id FROM users WHERE email = ${email}`;
  return userRes.rowCount > 0 ? userRes.rows[0].id : null;
}

// Note: Course-related functions have been removed as courses are disabled

async function getRecentSessions(): Promise<any> {
  const sessionsRes = await sql`SELECT u.id, u.email, s."sessionToken", s.expires FROM sessions s JOIN users u ON s."userId" = u.id ORDER BY s.expires DESC`
  return sessionsRes.rows;
}

export {
  getUserIdFromEmail,
  getRecentSessions
}
