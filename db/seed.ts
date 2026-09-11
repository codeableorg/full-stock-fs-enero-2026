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

  await client.query("COMMIT");
  console.log("Seed ejecutado con éxito");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
}

await pool.end();
