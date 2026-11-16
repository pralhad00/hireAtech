/**
 * Create the first admin account (spec §12).
 *
 *   npm run create-admin
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env.local, validates the
 * password rules, bcrypt-hashes it (cost 12), and inserts a user with
 * role admin. No credentials or hashes are committed to the repo.
 *
 * Connects directly with pg (same pattern as scripts/run-sql.ts) because
 * tsx does not load Next.js env files automatically.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";
import { hashPassword } from "@/lib/auth/password";

// --- tiny .env.local reader (tsx does not load Next.js env files) ---
function loadEnvFile(): void {
  const file = join(process.cwd(), ".env.local");
  try {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match) continue; // skips comments and blank lines too
      const [, key, rawValue] = match;
      let value = rawValue;
      if (value.length >= 2 && value[0] === value[value.length - 1] && (value[0] === '"' || value[0] === "'")) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env.local may not exist yet
  }
}

loadEnvFile();

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local (copy .env.example first).");
    process.exit(1);
  }

  if (!passwordRegex.test(password)) {
    console.error("error: ADMIN_PASSWORD must be 8–64 characters with at least one letter and one number.");
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("error: DATABASE_URL is missing in .env.local.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl, max: 1 });

  try {
    // Check if an admin already exists
    const existing = await pool.query(
      `SELECT id FROM users WHERE lower(email) = lower($1) AND role = 'admin'`,
      [email],
    );
    if (existing.rowCount && existing.rowCount > 0) {
      console.log(`Admin user already exists: ${email}`);
      return;
    }

    // Hash password (bcrypt cost 12, spec §6)
    const passwordHash = await hashPassword(password);

    // Insert admin user
    await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, 'admin')`,
      [email, passwordHash, "Administrator", "9800000000"],
    );

    console.log(`Admin user created: ${email}`);
  } finally {
    await pool.end();
  }
}

main().catch((err: unknown) => {
  console.error("create-admin failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
