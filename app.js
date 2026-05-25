import express from "express";
import expressEjsLayout from "express-ejs-layouts";
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(expressEjsLayout);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/product", (req, res) => {
  res.render("product");
});

app.get("/category", (req, res) => {
  res.render("category");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/privacy", (req, res) => {
  res.render("privacy");
});

app.get("/terms", (req, res) => {
  res.render("terms");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.get("/order-confirmation", (req, res) => {
  res.render("order-confirmation");
});

app.use((error, req, res, _) => {
  console.error(error);
  console.log("hola");

  res.render("404");
});

app.listen(PORT, () => {
  console.log(`Servidor encendido y escuchando en el puerto ${PORT}`);
});
