import { getDb, getNextId, saveDb } from "../db.js";

function getOrders(db) {
  if (!Array.isArray(db.orders)) {
    db.orders = [];
  }

  return db.orders;
}

export async function create(order) {
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

export async function findById(id) {
  const db = await getDb();

  if (!Array.isArray(db.orders)) return null;

  return db.orders.find((order) => order.id === id) || null;
}

export async function updateUserIdByEmail(email, userId) {
  const db = await getDb();
  if (!db.orders) return;

  db.orders.forEach((order) => {
    if (order.shippingInfo && order.shippingInfo.email === email) {
      order.userId = userId;
    }
  });

  await saveDb(db);
}
