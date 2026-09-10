import fs from "node:fs/promises";
import { pool } from "./pool.ts";
import path from "node:path";

const schema = await fs.readFile(path.join("db", "schema.sql"), "utf-8");

await pool.query(schema);

console.log("Schema creado con éxito");

await pool.end();
