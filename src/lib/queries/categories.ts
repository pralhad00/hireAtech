import "server-only";
import { cacheTag } from "next/cache";
import { query } from "@/lib/db";

/*
 * Category queries (spec §0: all SQL lives under lib/queries/; every value
 * is a parameter). These power /services, /services/[slug] and the home page.
 *
 * Cached with "use cache" so the pages don't hit Postgres on every request;
 * cacheTag("categories") lets Step 5's admin category management invalidate
 * them via revalidateTag("categories").
 */

export interface CategorySummary {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  approvedTechnicianCount: number;
}

export interface CategoryDetail extends CategorySummary {
  description: string;
  approvedTechnicianCount: number;
}

export const CATEGORIES_TAG = "categories";

/** All active categories, in name order, for the home grid and /services. */
export async function listCategories(): Promise<CategorySummary[]> {
  "use cache";
  cacheTag(CATEGORIES_TAG);
  const { rows } = await query<CategorySummary>(
    `SELECT c.slug,
            c.name,
            c.tagline,
            c.icon,
            COALESCE(t.approved_count, 0)::int AS "approvedTechnicianCount"
       FROM service_categories c
       LEFT JOIN (
         SELECT category_id, count(*)::int AS approved_count
           FROM technician_profiles
          WHERE approval_status = 'approved'
          GROUP BY category_id
       ) t ON t.category_id = c.id
      ORDER BY c.name`,
  );
  return rows;
}

/** One category by slug plus how many approved technicians it has. */
export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryDetail | null> {
  "use cache";
  cacheTag(CATEGORIES_TAG);
  const { rows } = await query<CategoryDetail>(
    `SELECT c.slug,
            c.name,
            c.tagline,
            c.description,
            c.icon,
            COALESCE(t.approved_count, 0)::int AS "approvedTechnicianCount"
       FROM service_categories c
       LEFT JOIN (
         SELECT category_id, count(*)::int AS approved_count
           FROM technician_profiles
          WHERE approval_status = 'approved'
          GROUP BY category_id
       ) t ON t.category_id = c.id
      WHERE c.slug = $1`,
    [slug],
  );
  return rows[0] ?? null;
}
