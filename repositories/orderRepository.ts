import { getDb, getNextId, saveDb } from "../db.ts";
import type { Db, Order } from "../types/index.ts";

function getOrders(db: Db) {
  if (!Array.isArray(db.orders)) {
    db.orders = [];
  }

  return db.orders;
}

export async function create(order: Omit<Order, "id">) {
  const db = await getDb();
  const orders = getOrders(db);
  const id = await getNextId("orders");
  const newOrder = {
    id,
    ...order,
  };

  orders.push(newOrder);
  await saveDb(db);

  return newOrder;
}

export async function findById(orderId: number) {
  const db = await getDb();

  if (!Array.isArray(db.orders)) return null;

  return db.orders.find((order) => order.id === orderId) || null;
}

export async function updateUserIdByEmail(email: string, userId: number) {
  const db = await getDb();
  if (!db.orders) return;

  db.orders.forEach((order) => {
    if (order.shippingInfo && order.shippingInfo.email === email) {
      order.userId = userId;
    }
  });

  await saveDb(db);
}
