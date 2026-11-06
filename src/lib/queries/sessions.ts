import "server-only";
import { query } from "../db";
import { createHash } from "crypto";

export interface SessionRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
}

/**
 * Hash a session token using SHA-256 for storage.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new session for a user.
 * Returns the raw token (only time it exists in plaintext) and the session row.
 */
export async function createSession(
  userId: string,
  token: string,
  expiresAt: Date,
): Promise<SessionRow> {
  const tokenHash = hashToken(token);
  const result = await query<SessionRow>(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, token_hash, expires_at, created_at`,
    [userId, tokenHash, expiresAt],
  );
  return result.rows[0];
}

/**
 * Find a valid session by raw token (hashes it first).
 * Joins with users to get user data in one query.
 */
export async function findSessionWithUser(token: string): Promise<{
  session: SessionRow;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: "customer" | "technician" | "admin";
    is_blocked: boolean;
  };
} | null> {
  const tokenHash = hashToken(token);
  const result = await query<SessionRow & {
    user_id: string;
    email: string;
    name: string;
    phone: string;
    role: "customer" | "technician" | "admin";
    is_blocked: boolean;
  }>(
    `SELECT s.id, s.user_id, s.token_hash, s.expires_at, s.created_at,
            u.email, u.name, u.phone, u.role, u.is_blocked
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [tokenHash],
  );
  const row = result.rows[0];
  if (!row) return null;
  const { email, name, phone, role, is_blocked, ...session } = row;
  return {
    session,
    user: { id: row.user_id, email, name, phone, role, is_blocked },
  };
}

/**
 * Delete a session by token (logout).
 */
export async function deleteSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await query(
    `DELETE FROM sessions WHERE token_hash = $1`,
    [tokenHash],
  );
}

/**
 * Delete all sessions for a user (password change, admin block).
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await query(
    `DELETE FROM sessions WHERE user_id = $1`,
    [userId],
  );
}

/**
 * Clean up expired sessions (opportunistic, called on login).
 */
export async function cleanupExpiredSessions(): Promise<void> {
  await query(
    `DELETE FROM sessions WHERE expires_at <= now()`,
    [],
  );
}