import { query } from "@/lib/db";

// NOTE: do not add `export const dynamic = ...` here; with cacheComponents
// enabled (next.config.ts) route segment config is not valid, and GET route
// handlers are rendered per-request anyway.

export async function GET() {
  try {
    await query("SELECT 1");
    return Response.json({ db: "ok" });
  } catch {
    // Friendly + no stack traces or driver details (spec §10). Server-side
    // details stay in the pg pool's own error handling / server logs.
    return Response.json({ db: "down" }, { status: 503 });
  }
}
