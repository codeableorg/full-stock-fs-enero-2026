import { getDb, getNextId, saveDb } from "../db.js";

function getCarts(db) {
  if (!Array.isArray(db.carts)) {
    db.carts = [];
  }

  return db.carts;
}

export async function find(cartId) {
  const db = await getDb();
  const carts = getCarts(db);

  return carts.find((cart) => cart.id === cartId) || null;
}

export async function create(userId) {
  const db = await getDb();
  const carts = getCarts(db);
  const id = await getNextId("carts");

  const newCart = { id, userId, items: [] };
  carts.push(newCart);
  await saveDb(db);

  return newCart;
}

export async function update(updatedCart) {
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
