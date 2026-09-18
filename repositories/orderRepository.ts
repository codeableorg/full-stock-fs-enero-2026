import { pool } from "../db/pool.ts";
import type { Order, OrderItem } from "../types/index.ts";

async function findItems(orderId: number) {
  const { rows } = await pool.query<OrderItem>(
    `
    SELECT product_id AS "productId", name, price, img_src AS "imgSrc", quantity
    FROM order_items
    WHERE order_id = $1`,
    [orderId],
  );

  return rows;
}

export async function create(order: Omit<Order, "id">) {
  const { rows } = await pool.query<Omit<Order, "items">>(
    `INSERT INTO orders (user_id, shipping_info, total, status, created_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_id AS "userId", shipping_info AS "shippingInfo", total, status, created_at AS "createdAt"`,
    [
      order.userId,
      order.shippingInfo,
      order.total,
      order.status,
      order.createdAt,
    ],
  );

  const newOrder = rows[0];

  for (const item of order.items) {
    await pool.query(
      `INSERT INTO order_items (order_id, product_id, name, price, img_src, quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        newOrder.id,
        item.productId,
        item.name,
        item.price,
        item.imgSrc,
        item.quantity,
      ],
    );
  }

  return { ...newOrder, items: order.items };
}

export async function findById(orderId: number) {
  const { rows } = await pool.query<Omit<Order, "items">>(
    `SELECT id, user_id AS "userId", shipping_info AS "shippingInfo", total, status, created_at AS "createdAt"
     FROM orders 
     WHERE id = $1
     `,
    [orderId],
  );

  const order = rows.at(0);
  if (!order) return null;
  const items = await findItems(order.id);

  return { ...order, items };
}

export async function updateUserIdByEmail(email: string, userId: number) {
  await pool.query(
    `UPDATE orders SET user_id = $2 WHERE shipping_info->>'email' = $1`,
    [email, userId],
  );
}
