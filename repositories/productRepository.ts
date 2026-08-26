import { getDb } from "../db.ts";

export async function findAll() {
  const db = await getDb();
  return db.products;
}

export async function find(productId: number) {
  const db = await getDb();
  const product = db.products.find((product) => product.id === productId);
  return product;
}
