import "server-only";
import bcrypt from "bcryptjs";

const BCRYPT_COST = 12;

/**
 * Hash a plain password with bcrypt at cost 12.
 * Returns the hash (includes salt, starts with $2b$12$ or similar).
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

/**
 * Compare a plain password against a stored bcrypt hash.
 * Runs in constant-ish time (bcrypt itself is constant-time for the hash part).
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a dummy hash for equal-timing comparison when email doesn't exist.
 * Uses a fixed dummy password so the compare takes the same time as a real one.
 */
export async function dummyVerify(): Promise<boolean> {
  // Pre-generated hash of "dummy" at cost 12
  const dummyHash = "$2b$12$YR7WrMQ5v.oJTsWrs6iFgOBZYaVOsCc9z6egnQLYYREMchWaRNyOy";
  return bcrypt.compare("dummy", dummyHash);
}