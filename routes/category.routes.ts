import { Router } from "express";
import * as productController from "../controllers/productController.ts";

const categoryRouter = Router();

//todo renombrar o mover controlador
categoryRouter.get("/:slug", productController.renderCategory);

export default categoryRouter;
