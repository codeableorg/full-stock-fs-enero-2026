import { AppError } from "../utils/errorUtils.js";
import { readDataFile } from "../utils/handlerUtils.js";

export async function productHandler(req, res) {
  const { id } = req.params;

  const data = await readDataFile();

  const product = data.products.find((product) => product.id === parseInt(id));

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.render("product", { product });
}
