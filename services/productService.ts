import * as productRepository from "../repositories/productRepository.ts";

interface PriceFilters {
  minPrice?: number | null;
  maxPrice?: number | null;
}

export async function getProductsByCategory(
  categoryId: number,
  filters: PriceFilters = {},
) {
  const products = await productRepository.findAll();

  // Aplicamos la lógica de filtrado
  const minPrice = filters.minPrice ?? -Infinity;
  const maxPrice = filters.maxPrice ?? Infinity;

  return products.filter((product) => {
    const belongsToCategory = product.categoryId === categoryId;
    const meetsMinPrice = product.price >= minPrice;
    const meetsMaxPrice = product.price <= maxPrice;

    return belongsToCategory && meetsMinPrice && meetsMaxPrice;
  });
}

export async function getProductById(productId: number) {
  const product = await productRepository.find(productId);
  return product;
}
