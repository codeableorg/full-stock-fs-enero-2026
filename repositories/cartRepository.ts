import { getDb, getNextId, saveDb } from "../db.ts";
import { pool } from "../db/pool.ts";
import type { Cart, Db } from "../types/index.ts";

function getCarts(db: Db) {
  if (!Array.isArray(db.carts)) {
    db.carts = [];
  }

  return db.carts;
}

// CART_ID, PRODUCT_ID, QUANTITY
async function findItems(cartId: number) {
  const { rows } = await pool.query(
    `SELECT product_id AS productId, quantity
     FROM cart_items
     WHERE cart_id = $1
    `,
    [cartId],
  );

  return rows;
}

async function withItems(cart: Cart) {
  if (!cart) return null;

  const items = await findItems(cart.id);
  return { ...cart, items };
}

export async function find(cartId: number) {
  const { rows } = await pool.query(
    `
    SELECT * FROM CARTS WHERE id = $1
  `,
    [cartId],
  );

  return withItems(rows.at(0));
}

export async function findByUserId(userId: number) {
  const { rows } = await pool.query(
    `SELECT id, user_id AS userId
     FROM carts
     WHERE user_id = $1`,
    [userId],
  );

  return withItems(rows.at(0));
}

export async function destroy(cartId: number) {
  await pool.query(`DELETE FROM carts WHERE id = $1`, [cartId]);
}

export async function create(userId: number | null) {
  const { rows } = await pool.query(
    `INSERT INTO carts (user_id)
     VALUES ($1) 
     RETURNING id, user_id as userId
    `,
    [userId],
  );

  return { ...rows[0], items: [] };
}

export async function update(updatedCart: Cart) {
  // Todo: verificar con la UI
  await pool.query(
    `
    UPDATE carts set user_id = $2 WHERE id = $1
  `,
    [updatedCart.id, updatedCart.userId ?? null],
  );

  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [
    updatedCart.id,
  ]);

  for (const item of updatedCart.items) {
    await pool.query(
      `INSERT INTO cart_items(cart_id, product_id, quantity) 
      VALUES ( $1, $2, $3)`,
      [updatedCart.id, item.productId, item.quantity],
    );
  }

  return updatedCart;
}
