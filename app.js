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

app.listen(PORT, () => {
  console.log(`Servidor encendido y escuchando en el puerto ${PORT}`);
});
