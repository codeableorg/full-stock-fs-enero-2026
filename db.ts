import fs from "node:fs/promises";
import path from "node:path";
import type { Db } from "./types/index.ts";

const DATA_PATH = path.join("data", "data.json");

type CollectionName = keyof Db;

export async function getDb(): Promise<Db> {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data);
}

export async function saveDb(db: Db) {
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2));
}

export async function getNextId(collectionName: CollectionName) {
  const db = await getDb();
  const collection = db[collectionName] || [];

  if (collection.length === 0) return 1;

  const ids = collection.map((item) => item.id);
  const maxId = Math.max(...ids);

  return maxId + 1;
}

// Revisar todo pues ahora tenemos otra arquitectura
// Todo: Enviar un código correcto para evitar el 404 genérico
