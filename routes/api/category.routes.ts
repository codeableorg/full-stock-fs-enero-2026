import { Router } from "express";
import { pool } from "../../db/pool.ts";

const categoryRouter = Router();

categoryRouter.get("/", async (_req, res) => {
  const result = await pool.query("SELECT * FROM categories");

  res.json(result.rows);
});

export default categoryRouter;
