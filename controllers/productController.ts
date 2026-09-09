import type { Request, Response } from "express";
import * as productService from "../services/productService.ts";
import { AppError } from "../utils/errorUtils.ts";

export async function renderProduct(req: Request, res: Response) {
  const { id } = req.params;

  const product = await productService.getProductById(Number(id));

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.render("product", { product });
}
