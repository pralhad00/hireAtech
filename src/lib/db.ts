import "server-only";
import pg, { type QueryResult, type QueryResultRow } from "pg";

const { Pool } = pg;

/**
 * Shared PostgreSQL connection pool for the whole app.
 * - DATABASE_URL points at the LIMITED user (hireatech_app, spec §10). It must
 *   use a connection string from .env.local, never a hard-coded one.
 * - Kept on globalThis in development so hot reload reuses the same pool
 *   instead of opening a new one on every code change.
 */
const globalForDb = globalThis as unknown as { hireatechPool?: pg.Pool };

export const pool: pg.Pool =
  globalForDb.hireatechPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

if (process.env.NODE_ENV !== "production") globalForDb.hireatechPool = pool;

// If the database goes away, idle connections emit errors - log them instead of
// letting them crash the Node process (never crash, spec §1.4).
pool.on("error", (err) => {
  console.error("postgres idle client error:", err.message);
});

/**
 * The ONLY way app code runs SQL (spec §0 rule 4: all SQL lives under
 * lib/queries/, which must call this). Text must be parameterized: `$1, $2, …`.
 * Example: query('SELECT * FROM users WHERE email = $1', [email])
 */
export function query<R extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
): Promise<QueryResult<R>> {
  return pool.query<R>(text, values as unknown[]);
}
