import "server-only";
import { cookies } from "next/headers";
import { createSession, findSessionWithUser, deleteSession, deleteAllUserSessions, cleanupExpiredSessions } from "../queries/sessions";
import { randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "hireatech_session";
const SESSION_DAYS = 7;

/**
 * Generate a secure random session token (32 bytes = 64 hex chars).
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Calculate session expiry date (7 days from now).
 */
export function getSessionExpiry(): Date {
  const date = new Date();
  date.setDate(date.getDate() + SESSION_DAYS);
  return date;
}

/**
 * Set the session cookie on the response.
 */
export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Clear the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get the session token from the cookie.
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Create a new session for a user and set the cookie.
 * Returns the session row.
 */
export async function createUserSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const expiresAt = getSessionExpiry();
  await createSession(userId, token, expiresAt);
  await setSessionCookie(token, expiresAt);
  return { token, expiresAt };
}

/**
 * Validate the current request's session.
 * Returns { session, user } if valid, null otherwise.
 */
export async function validateSession(): Promise<{
  session: { token_hash: string; user_id: string; expires_at: Date };
  user: { id: string; email: string; full_name: string; phone: string; role: "customer" | "technician" | "admin"; is_blocked: boolean };
} | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const result = await findSessionWithUser(token);
  if (!result) return null;

  const { session, user } = result;
  if (user.is_blocked) return null;

  return {
    session: { token_hash: session.token_hash, user_id: session.user_id, expires_at: session.expires_at },
    user,
  };
}

/**
 * Log out the current user (delete session + clear cookie).
 */
export async function logout(): Promise<void> {
  const token = await getSessionToken();
  if (token) {
    await deleteSession(token);
  }
  await clearSessionCookie();
}

/**
 * Log out the current user from all sessions (password change).
 */
export async function logoutAllSessions(userId: string): Promise<void> {
  await deleteAllUserSessions(userId);
  await clearSessionCookie();
}

/**
 * Clean up expired sessions (call opportunistically on login).
 */
export async function cleanupSessions(): Promise<void> {
  await cleanupExpiredSessions();
}