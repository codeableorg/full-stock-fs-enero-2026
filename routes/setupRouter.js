import pagesRouter from "./pages.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import cartRouter from "./cart.routes.js";
import checkoutRouter from "./checkout.routes.js";
import authRouter from "./auth.routes.js";
import * as orderController from "../controllers/orderController.js";

export function setupRouter(router) {
  router.use("/", pagesRouter);
  router.use("/category", categoryRouter);
  router.use("/product", productRouter);
  router.use("/cart", cartRouter);
  router.use("/checkout", checkoutRouter);
  router.get("/order-confirmation", orderController.renderOrderConfirmation);
  router.use("/signup", authRouter);
}
