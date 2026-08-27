import { getDb, getNextId, saveDb } from "../db.ts";
import type { Cart, Db } from "../types/index.ts";

function getCarts(db: Db) {
  if (!Array.isArray(db.carts)) {
    db.carts = [];
  }

  return db.carts;
}

export async function find(cartId: number) {
  const db = await getDb();
  const carts = getCarts(db);

  return carts.find((cart) => cart.id === cartId) || null;
}

export async function findByUserId(userId: number) {
  const db = await getDb();
  const carts = getCarts(db);

  return carts.find((cart) => cart.userId === userId) || null;
}

export async function destroy(cartId: number) {
  const db = await getDb();
  const carts = getCarts(db);

  const cartIndex = carts.findIndex((cart) => cart.id === cartId);

  if (cartIndex === -1) return;

  carts.splice(cartIndex, 1);
  await saveDb(db);
}

export async function create(userId: number) {
  const db = await getDb();
  const carts = getCarts(db);
  const id = await getNextId("carts");

  const newCart = { id, userId, items: [] };
  carts.push(newCart);
  await saveDb(db);

  return newCart;
}

export async function update(updatedCart: Cart) {
  const db = await getDb();
  const carts = getCarts(db);
  const cartIndex = carts.findIndex((cart) => cart.id === updatedCart.id);

  if (cartIndex === -1) {
    carts.push(updatedCart);
  } else {
    carts[cartIndex] = updatedCart;
  }

  await saveDb(db);

  return updatedCart;
}
