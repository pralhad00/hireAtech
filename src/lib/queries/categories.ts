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
  avgRating?: number;
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
            COALESCE(t.approved_count, 0)::int AS "approvedTechnicianCount",
            COALESCE(r.avg_rating::numeric(3,2), 0)::float8 AS "avgRating"
       FROM service_categories c
       LEFT JOIN (
         SELECT category_id, count(*)::int AS approved_count
           FROM technician_profiles
          WHERE approval_status = 'approved'
          GROUP BY category_id
       ) t ON t.category_id = c.id
       LEFT JOIN (
         SELECT tp.category_id, AVG(rv.rating)::numeric(3,2) AS avg_rating
           FROM technician_profiles tp
           JOIN reviews rv ON rv.technician_id = tp.user_id
          WHERE tp.approval_status = 'approved'
          GROUP BY tp.category_id
       ) r ON r.category_id = c.id
      ORDER BY c.name`,
  );
  return rows;
}

/** All active categories as id/name pairs, for technician category selection. */
export async function listCategoryOptions(): Promise<{ id: string; name: string }[]> {
  "use cache";
  cacheTag(CATEGORIES_TAG);
  const { rows } = await query<{ id: string; name: string }>(
    `SELECT id, name FROM service_categories WHERE is_active = true ORDER BY name`,
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

/** All categories including inactive, for admin management. */
export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  approvedTechnicianCount: number;
  createdAt: Date;
  aliases: CategoryAlias[];
}

export async function listAllCategories(): Promise<AdminCategory[]> {
  const result = await query<AdminCategoryRaw>(
    `SELECT c.id, c.slug, c.name, c.tagline, c.description, c.icon,
            c.is_active, c.created_at,
            COALESCE(t.approved_count, 0)::int AS approved_count
     FROM service_categories c
     LEFT JOIN (
       SELECT category_id, count(*)::int AS approved_count
         FROM technician_profiles
        WHERE approval_status = 'approved'
        GROUP BY category_id
     ) t ON t.category_id = c.id
     ORDER BY c.name`,
    [],
  );

  // Fetch aliases for all categories in one query
  const categoryIds = result.rows.map((r) => r.id);
  const aliasMap = new Map<string, CategoryAlias[]>();
  if (categoryIds.length > 0) {
    const placeholders = categoryIds.map((_, i) => `$${i + 1}`).join(",");
    const aliasResult = await query<CategoryAliasRaw>(
      `SELECT category_id, id, alias
       FROM category_aliases
       WHERE category_id IN (${placeholders})
       ORDER BY alias`,
      categoryIds,
    );
    for (const row of aliasResult.rows) {
      const list = aliasMap.get(row.category_id) ?? [];
      list.push({ id: row.id, alias: row.alias });
      aliasMap.set(row.category_id, list);
    }
  }

  return result.rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    icon: row.icon,
    isActive: row.is_active,
    approvedTechnicianCount: row.approved_count,
    createdAt: row.created_at,
    aliases: aliasMap.get(row.id) ?? [],
  }));
}

interface AdminCategoryRaw {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: Date;
  approved_count: number;
}

interface CategoryAliasRaw {
  category_id: string;
  id: string;
  alias: string;
}

interface AdminCategoryRaw {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: Date;
  approved_count: number;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  isActive: boolean;
}

export async function createCategory(input: CreateCategoryInput): Promise<void> {
  await query(
    `INSERT INTO service_categories (slug, name, tagline, description, icon, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [input.slug, input.name, input.tagline, input.description, input.icon, input.isActive],
  );
}

export interface UpdateCategoryInput {
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  isActive: boolean;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<void> {
  await query(
    `UPDATE service_categories
      SET name = $2,
          tagline = $3,
          description = $4,
          icon = $5,
          is_active = $6
     WHERE id = $1`,
    [id, input.name, input.tagline, input.description, input.icon, input.isActive],
  );
}

export async function setCategoryActive(
  id: string,
  isActive: boolean,
): Promise<void> {
  await query(
    `UPDATE service_categories SET is_active = $2 WHERE id = $1`,
    [id, isActive],
  );
}

/** Aliases for one category. */
export interface CategoryAlias {
  id: string;
  alias: string;
}

export async function listCategoryAliases(
  categoryId: string,
): Promise<CategoryAlias[]> {
  const result = await query<CategoryAlias>(
    `SELECT id, alias FROM category_aliases WHERE category_id = $1 ORDER BY alias`,
    [categoryId],
  );
  return result.rows;
}

export async function createCategoryAlias(
  categoryId: string,
  alias: string,
): Promise<void> {
  await query(
    `INSERT INTO category_aliases (category_id, alias) VALUES ($1, $2)`,
    [categoryId, alias],
  );
}

export async function deleteCategoryAlias(aliasId: string): Promise<void> {
  await query(`DELETE FROM category_aliases WHERE id = $1`, [aliasId]);
}

/** Check if a slug is already taken by another category. */
export async function slugExists(
  slug: string,
  excludeId: string | null,
): Promise<boolean> {
  const params: unknown[] = [slug];
  let sql = `SELECT 1 FROM service_categories WHERE slug = $1`;
  if (excludeId) {
    params.push(excludeId);
    sql += ` AND id <> $2`;
  }
  const result = await query<{ exists: boolean }>(sql, params);
  return result.rows.length > 0;
}
