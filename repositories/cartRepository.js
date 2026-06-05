import { getDb, saveDb } from "../db.js";

export async function getCart() {
  const db = await getDb();
  return db.carts[0] || { id: 1, items: [] };
}

export async function updateCart(newCart) {
  const db = await getDb();
  db.carts[0] = newCart;
  await saveDb(db);
}
