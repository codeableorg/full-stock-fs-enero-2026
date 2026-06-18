import express from "express";
import expressEjsLayout from "express-ejs-layouts";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./controllers/notFoundController.js";
import router from "./routes/router.js";
import { cartContext } from "./middlewares/cartContext.js";
import { authContext } from "./middlewares/authContext.js";
const app = express();
const PORT = 3000;

const COOKIE_SECRET = process.env.COOKIE_SECRET || "full-stock-cookie-secret";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(expressEjsLayout);

app.use(cookieParser(COOKIE_SECRET));

app.use(authContext);
app.use(cartContext);

app.use(router);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor encendido y escuchando en el puerto ${PORT}`);
});
