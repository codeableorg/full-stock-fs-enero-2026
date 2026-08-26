import { getDb, getNextId, saveDb } from "../db.ts";

// function getUsers(db) {
//   if (!Array.isArray(db.users)) {
//     db.carts = [];
//   }

//   return db.carts;
// }

export async function findByEmail(email) {
  const db = await getDb();
  return db.users.find((user) => user.email === email) || null;
}

export async function findById(userId) {
  const db = await getDb();
  return db.users.find((user) => user.id === userId) || null;
}

export async function create(userData) {
  const db = await getDb();
  const nextId = await getNextId("users");

  const newUser = { id: nextId, ...userData };
  db.users.push(newUser);
  await saveDb(db);
  return newUser;
}
