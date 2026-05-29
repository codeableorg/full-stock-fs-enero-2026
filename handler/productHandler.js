import { readDataFile } from "../utils.js";

export async function productHandler(req, res) {
  const { id } = req.params;

  const data = await readDataFile();

  const product = data.products.find((product) => product.id === parseInt(id));

  if (!product) {
    return res.status(404).render("404");
  }

  res.render("product", { product });
}
