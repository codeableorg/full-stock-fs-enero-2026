import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.join("data", "data.json");

export async function productHandler(req, res) {
  const { id } = req.params;

  const dataJson = await fs.readFile(DATA_PATH);

  const data = JSON.parse(dataJson);

  const product = data.products.find((product) => product.id === parseInt(id));

  if (!product) {
    return res.status(404).render("404");
  }

  res.render("product", { product });
}
