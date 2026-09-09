import { Router } from "express";
import * as categoryController from "../controllers/categoryController.ts";

const categoryRouter = Router();

//* Prioriza legibilidad de código
categoryRouter.get("/:slug", categoryController.renderCategory);

//* Prioriza lógica de negocio
// En la UI se renderizan productos filtrados por categoria
// categoryRouter.get("/:slug", productController.renderCategory);

export default categoryRouter;
