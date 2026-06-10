import { Router } from "express";

import * as pagesController from "./controllers/pagesController.js";
import * as productController from "./controllers/productController.js";
import * as cartController from "./controllers/cartController.js";
import * as orderController from "./controllers/orderController.js";
import * as authController from "./controllers/authController.js";

export const router = Router();

router.get("/", pagesController.renderHome);
router.get("/about", pagesController.renderAbout);
router.get("/terms", pagesController.renderTerms);
router.get("/privacy", pagesController.renderPrivacy);

//todo renombrar o mover controlador
router.get("/category/:slug", productController.renderCategory);
router.get("/product/:id", productController.renderProduct);

router.get("/cart", cartController.renderCart);
router.post("/cart/add-item", cartController.addItem);
router.post("/cart/update-item", cartController.updateItem);
router.post("/cart/delete-item", cartController.deleteItem);

// Order & Checkout
router.get("/checkout", orderController.renderCheckout);
router.post("/checkout/place-order", orderController.placeOrder);
router.get("/order-confirmation", orderController.renderOrderConfirmation);

// Auth
router.get("/signup", authController.renderSignup);
router.post("/signup", authController.handleSignup);
