import { getDb } from "../db.ts";

export async function findAll() {
  const db = await getDb();
  return db.categories;
}
