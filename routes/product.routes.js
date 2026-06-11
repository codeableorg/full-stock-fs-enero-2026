import { Router } from "express";
import * as productController from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/:id", productController.renderProduct);

export default productRouter;
