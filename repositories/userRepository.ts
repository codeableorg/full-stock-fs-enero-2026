import { pool } from "../db/pool.ts";
import type { User } from "../types/index.ts";

const SELECT_USER = `SELECT * from users`;

export async function findByEmail(email: string) {
  const { rows } = await pool.query<User>(`${SELECT_USER} WHERE email = $1`, [
    email,
  ]);
  return rows.at(0);
}

export async function findById(userId: number) {
  const { rows } = await pool.query<User>(`${SELECT_USER} WHERE id = $1`, [
    userId,
  ]);
  return rows.at(0);
}

export async function create(userData: Omit<User, "id">) {
  const { rows } = await pool.query<User>(
    `INSERT INTO users(email, password)
    VALUES ($1,$2)
    RETURNING *`,
    [userData.email, userData.password],
  );

  return rows.at(0);
}
