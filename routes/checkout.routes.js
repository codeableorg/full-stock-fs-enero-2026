import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
const checkoutRouter = Router();

checkoutRouter.get("/", orderController.renderCheckout);
checkoutRouter.post("/place-order", orderController.placeOrder);
checkoutRouter.get(
  "/order-confirmation",
  orderController.renderOrderConfirmation,
);

export default checkoutRouter;
