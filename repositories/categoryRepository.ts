import { getDb } from "../db.ts";
import { pool } from "../db/pool.ts";
import type { Category } from "../types/index.ts";

const SELECT_CATEGORY = `
  SELECT id, name, slug, img_src as "imgSrc", alt, description
  FROM categories
`;

export async function findAll(): Promise<Category[]> {
  const { rows } = await pool.query<Category>(`${SELECT_CATEGORY} ORDER BY id`);
  return rows;
}

export async function findBySlug(slug: string): Promise<Category | undefined> {
  const { rows } = await pool.query<Category>(
    `${SELECT_CATEGORY} WHERE slug = $1`,
    [slug],
  );
  return rows.at(0);
}
