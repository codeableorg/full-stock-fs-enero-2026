import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Db } from "../types/index.ts";
import { pool } from "./pool.ts";

const raw = await readFile(join("data", "data.json"), "utf-8");
const data: Db = JSON.parse(raw);

const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(
    "TRUNCATE categories, products, users, carts, orders RESTART IDENTITY CASCADE",
  );

  for (const category of data.categories) {
    await client.query(
      `INSERT INTO categories (id, name, slug, img_src, alt, description)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        category.id,
        category.name,
        category.slug,
        category.imgSrc,
        category.alt,
        category.description,
      ],
    );
  }

  for (const product of data.products) {
    await client.query(
      `
      INSERT INTO products (id, name, img_src, price, description, category_id, features)
      VALUES ($1,$2,$3,$4,$5,$6, $7)`,
      [
        product.id,
        product.name,
        product.imgSrc,
        product.price,
        product.description,
        product.categoryId,
        product.features,
      ],
    );
  }

  await client.query(
    "SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories))",
  );
  await client.query(
    "SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products))",
  );

  await client.query("COMMIT");
  console.log("Seed ejecutado con éxito");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
}

await pool.end();
