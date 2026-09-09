import type { Request, Response } from "express";
import * as categoryService from "../services/categoryService.ts";
import { parsePriceToCents } from "../utils/handlerUtils.ts";
import { AppError } from "../utils/errorUtils.ts";
import * as productService from "../services/productService.ts";

export async function renderCategory(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;

  // 1. Valida que la categoría exista utilizando el servicio
  const category = await categoryService.getCategoryBySlug(slug);

  if (!category) {
    throw new AppError("Categoría no encontrada", 404);
  }

  // 2. Manejo de Input (Preocupación del Controller)
  const minPrice =
    typeof req.query.minPrice === "string"
      ? parsePriceToCents(req.query.minPrice)
      : null;
  const maxPrice =
    typeof req.query.maxPrice === "string"
      ? parsePriceToCents(req.query.maxPrice)
      : null;

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
