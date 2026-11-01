/**
 * Run a db SQL file without typing connection details (dev helper, §12).
 *
 *   npm run db:setup   - create the limited app role + its rights   (db/setup.sql)
 *   npm run db:schema  - create all tables/indexes/extensions       (db/schema.sql)
 *   npm run db:seed    - insert categories + aliases                (db/seed.sql)
 *   npm run db:reset   - DEV ONLY: wipe everything, then schema + seed
 *
 * Always connects with DATABASE_ADMIN_URL because SETUP/SCHEMA/RESET need rights
 * the limited app user must never have (spec §10).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

// --- tiny .env.local reader (tsx does not load Next.js env files) ---
function loadEnvFile(local: boolean): void {
  const file = join(process.cwd(), local ? ".env.local" : ".env.example");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue; // skips comments and blank lines too
    const [, key, rawValue] = match;
    let value = rawValue;
    // strip one pair of matching quotes, keep inner text as-is
    if (value.length >= 2 && value[0] === value[value.length - 1] && (value[0] === '"' || value[0] === "'")) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

type Command = "setup" | "schema" | "seed" | "reset";

const FILES: Record<Exclude<Command, "reset">, string> = {
  setup: "db/setup.sql",
  schema: "db/schema.sql",
  seed: "db/seed.sql",
};

async function runSqlFile(pool: Pool, file: string): Promise<void> {
  const sql = readFileSync(join(process.cwd(), file), "utf8");
  await pool.query(sql); // multiple plain statements are allowed
  console.log(`ok: ran ${file}`);
}

async function reset(pool: Pool): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("db:reset refuses to run when NODE_ENV=production (spec §10).");
  }
  console.log("dropping every table in schema public ...");
  await pool.query("DROP SCHEMA public CASCADE");
  await pool.query("CREATE SCHEMA public");
  console.log("rebuilding schema and seed data ...");
  await runSqlFile(pool, FILES.setup);
  await runSqlFile(pool, FILES.schema);
  await runSqlFile(pool, FILES.seed);
}

async function main(): Promise<void> {
  const command = process.argv[2] as Command | undefined;
  if (!command || !(["setup", "schema", "seed", "reset"] as const).includes(command)) {
    console.error("usage: npm run db:setup | db:schema | db:seed | db:reset");
    process.exit(1);
  }

  loadEnvFile(true);
  const adminUrl = process.env.DATABASE_ADMIN_URL;
  if (!adminUrl) {
    console.error("error: DATABASE_ADMIN_URL is missing in .env.local (copy .env.example first).");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: adminUrl, max: 1 });
  try {
    if (command === "reset") {
      await reset(pool);
    } else {
      await runSqlFile(pool, FILES[command]);
      if (command === "setup" || command === "schema") {
        // Grant rights on tables that already exist (default privileges only
        // cover future tables, so run setup after schema for a first-time build).
        await runSqlFile(pool, FILES.setup);
      }
    }
  } finally {
    await pool.end();
  }
}

main().catch((err: unknown) => {
  console.error("db command failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
