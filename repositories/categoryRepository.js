import { getDb } from "../db.js";

export async function findAll() {
  const db = await getDb();
  return db.categories;
}
