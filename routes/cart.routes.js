import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
const cartRouter = Router();

cartRouter.get("/", cartController.renderCart);
cartRouter.post("/add-item", cartController.addItem);
cartRouter.post("/update-item", cartController.updateItem);
cartRouter.post("/delete-item", cartController.deleteItem);

export default cartRouter;
