import { pool } from "../db/pool.ts";
import type { Product } from "../types/index.ts";

const SELECT_PRODUCT = `
  SELECT id, name, img_src AS "imgSrc", price, description, category_id as "categoryId", features
  FROM products
`;

export async function findAll(): Promise<Product[]> {
  const { rows } = await pool.query<Product>(`${SELECT_PRODUCT} ORDER BY id`);
  return rows;
}

export async function find(productId: number): Promise<Product | undefined> {
  const { rows } = await pool.query<Product>(
    `${SELECT_PRODUCT} WHERE id = $1`,
    [productId],
  );
  return rows.at(0);
}
