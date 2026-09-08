import pagesRouter from "./pages.routes.ts";
import categoryRouter from "./category.routes.ts";
import productRouter from "./product.routes.ts";
import cartRouter from "./cart.routes.ts";
import checkoutRouter from "./checkout.routes.ts";
import authRouter from "./auth.routes.ts";
import type { Router } from "express";

export function setupRouter(router: Router) {
  router.use("/", pagesRouter);
  router.use("/category", categoryRouter);
  router.use("/product", productRouter);
  router.use("/cart", cartRouter);
  router.use("/checkout", checkoutRouter);
  router.use("/auth", authRouter);
}
