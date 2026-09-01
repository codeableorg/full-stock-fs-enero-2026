import { getDb, getNextId, saveDb } from "../db.ts";
import type { Db, User } from "../types/index.ts";

function getUsers(db: Db) {
  if (!Array.isArray(db.users)) {
    db.users = [];
  }

  return db.users;
}

export async function findByEmail(email: string) {
  const db = await getDb();
  return getUsers(db).find((user) => user.email === email) || null;
}

export async function findById(userId: number) {
  const db = await getDb();
  return getUsers(db).find((user) => user.id === userId) || null;
}

export async function create(userData: Omit<User, "id">) {
  const db = await getDb();
  const nextId = await getNextId("users");
  // Todo:  restringir TS pues con un objeto y el spread esto pasa
  const newUser: User = { id: nextId, ...userData };
  getUsers(db).push(newUser);
  await saveDb(db);
  return newUser;
}
