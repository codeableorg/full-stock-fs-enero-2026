import { Router } from "express";
import * as categoryController from "../../controllers/categoryController.ts";

const categoryRouter = Router();

// /api/categories/
categoryRouter.get("/", categoryController.getAll);
categoryRouter.get("/:slug", categoryController.getOneBySlug);
categoryRouter.get("/:slug/products", categoryController.getProductsBySlug);

export default categoryRouter;
