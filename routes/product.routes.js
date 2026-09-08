import { Router } from "express";
import * as productController from "../controllers/productController.ts";

const productRouter = Router();

productRouter.get("/:id", productController.renderProduct);

export default productRouter;
