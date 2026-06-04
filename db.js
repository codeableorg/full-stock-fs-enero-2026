import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.join("data", "data.json");

export async function getDb() {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data);
}

export async function saveDb(db) {
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2));
}

// Revisar todo pues ahora tenemos otra arquitectura
// Todo: Enviar un código correcto para evitar el 404 genérico
