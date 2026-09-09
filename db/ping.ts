import { pool } from "./pool.ts";

const { rows } = await pool.query(
  "SELECT current_database() as database, current_user as user",
);

const { database, user } = rows[0];

console.log(`Conexión OK -> database: ${database}, usuario: ${user}`);

await pool.end();
