import "server-only";
import { query } from "../db";

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone: string;
  role: "customer" | "technician" | "admin";
  is_blocked: boolean;
  failed_login_attempts: number;
  locked_until: Date | null;
  created_at: Date;
}

export interface CreateUserParams {
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  role: "customer" | "technician" | "admin";
}

/**
 * Find a user by email (case-insensitive).
 */
export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result = await query<UserRow>(
    `SELECT id, email, password_hash, name, phone, role, is_blocked,
            failed_login_attempts, locked_until, created_at
     FROM users
     WHERE lower(email) = lower($1)`,
    [email],
  );
  return result.rows[0] ?? null;
}

/**
 * Find a user by ID.
 */
export async function findUserById(id: string): Promise<UserRow | null> {
  const result = await query<UserRow>(
    `SELECT id, email, password_hash, name, phone, role, is_blocked,
            failed_login_attempts, locked_until, created_at
     FROM users
     WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

/**
 * Create a new user.
 */
export async function createUser(params: CreateUserParams): Promise<UserRow> {
  const result = await query<UserRow>(
    `INSERT INTO users (email, password_hash, name, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, password_hash, name, phone, role, is_blocked,
               failed_login_attempts, locked_until, created_at`,
    [params.email, params.passwordHash, params.name, params.phone, params.role],
  );
  return result.rows[0];
}

/**
 * Increment failed login attempts and set lockout if threshold reached.
 */
export async function incrementFailedLogin(email: string): Promise<void> {
  await query(
    `UPDATE users
     SET failed_login_attempts = failed_login_attempts + 1,
         locked_until = CASE
           WHEN failed_login_attempts + 1 >= 5 THEN now() + interval '15 minutes'
           ELSE locked_until
         END
     WHERE lower(email) = lower($1)`,
    [email],
  );
}

/**
 * Reset failed login attempts on successful login.
 */
export async function resetFailedLogin(userId: string): Promise<void> {
  await query(
    `UPDATE users
     SET failed_login_attempts = 0, locked_until = NULL
     WHERE id = $1`,
    [userId],
  );
}

/**
 * Update user's password and clear other sessions (handled by session deletion).
 */
export async function updatePassword(userId: string, passwordHash: string): Promise<void> {
  await query(
    `UPDATE users SET password_hash = $1 WHERE id = $2`,
    [passwordHash, userId],
  );
}

/**
 * Check if user is currently locked out.
 */
export async function isUserLocked(email: string): Promise<boolean> {
  const result = await query<{ locked: boolean }>(
    `SELECT (locked_until IS NOT NULL AND locked_until > now()) AS locked
     FROM users WHERE lower(email) = lower($1)`,
    [email],
  );
  return result.rows[0]?.locked ?? false;
}

/**
 * Check if user is blocked.
 */
export async function isUserBlocked(email: string): Promise<boolean> {
  const result = await query<{ blocked: boolean }>(
    `SELECT is_blocked FROM users WHERE lower(email) = lower($1)`,
    [email],
  );
  return result.rows[0]?.blocked ?? false;
}