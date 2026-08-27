import * as categoryService from "../services/categoryService.ts";
import * as productService from "../services/productService.js";
import { AppError } from "../utils/errorUtils.ts";
import { parsePriceToCents } from "../utils/handlerUtils.ts";

export async function renderProduct(req, res) {
  const { id } = req.params;

  const product = await productService.getProductById(Number(id));

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.render("product", { product });
}

export async function renderCategory(req, res) {
  const { slug } = req.params;

  // 1. Valida que la categoría exista utilizando el servicio
  const category = await categoryService.getCategoryBySlug(slug);

  if (!category) {
    throw new AppError("Categoría no encontrada", 404);
  }

  // 2. Manejo de Input (Preocupación del Controller)
  const minPrice = parsePriceToCents(req.query.minPrice);
  const maxPrice = parsePriceToCents(req.query.maxPrice);

  // 3. Llamada al Servicio (Lógica delegada)
  const products = await productService.getProductsByCategory(category.id, {
    minPrice,
    maxPrice,
  });

  // 3. Respuesta
  res.render("category", {
    category,
    products,
    minPrice: minPrice !== null ? minPrice / 100 : "",
    maxPrice: maxPrice !== null ? maxPrice / 100 : "",
  });
}
