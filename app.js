import express from "express";
import expressEjsLayout from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import * as pagesController from "./controllers/pagesController.js";
import * as productController from "./controllers/productController.js";
import * as cartController from "./controllers/cartController.js";
import * as orderController from "./controllers/orderController.js";

import { countCartItems } from "./middlewares/global.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./controllers/notFoundController.js";
const app = express();
const PORT = 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "full-stock-cookie-secret";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.set("view engine", "ejs");

app.use(expressEjsLayout);

app.use(countCartItems);

app.get("/", pagesController.renderHome);
app.get("/about", pagesController.renderAbout);
app.get("/terms", pagesController.renderTerms);
app.get("/privacy", pagesController.renderPrivacy);

//todo renombrar o mover controlador
app.get("/category/:slug", productController.renderCategory);
app.get("/product/:id", productController.renderProduct);

app.get("/cart", cartController.renderCart);
app.post("/cart/add-item", cartController.addItem);
app.post("/cart/update-item", cartController.updateItem);
app.post("/cart/delete-item", cartController.deleteItem);

app.get("/checkout", orderController.renderCheckout);
app.get("/order-confirmation", orderController.renderOrderConfirmation);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor encendido y escuchando en el puerto ${PORT}`);
});
