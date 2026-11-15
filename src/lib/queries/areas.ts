import "server-only";
import { query } from "../db";

export interface AreaRow {
  id: string;
  name: string;
  city: string;
  district: string;
  is_active: boolean;
  created_at: Date;
}

/**
 * List all active areas, ordered alphabetically by name.
 */
export async function listAreas(): Promise<AreaRow[]> {
  const result = await query<AreaRow>(
    `SELECT id, name, city, district, is_active, created_at
     FROM areas
     WHERE is_active = true
     ORDER BY name ASC`,
  );
  return result.rows;
}

/**
 * Find an area by its id.
 */
export async function findAreaById(id: string): Promise<AreaRow | null> {
  const result = await query<AreaRow>(
    `SELECT id, name, city, district, is_active, created_at
     FROM areas
     WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}
