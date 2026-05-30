import { parsePriceToCents, readDataFile } from "../utils/handlerUtils.js";

export async function categoryHandler(req, res) {
  const { slug } = req.params;
  const { minPrice: minPriceQuery, maxPrice: maxPriceQuery } = req.query;

  const minPrice = parsePriceToCents(minPriceQuery) ?? -Infinity;
  const maxPrice = parsePriceToCents(maxPriceQuery) ?? Infinity;

  const data = await readDataFile();
  const category = data.categories.find((category) => category.slug === slug);

  if (!category) {
    return res.status(404).render("404");
  }

  const products = data.products.filter((product) => {
    const belongsToCategory = product.categoryId === category.id;
    const meetsMinPrice = product.price >= minPrice;
    const meetsMaxPrice = product.price <= maxPrice;

    return belongsToCategory && meetsMinPrice && meetsMaxPrice;
  });

  res.render("category", {
    category,
    products,
    minPrice: minPriceQuery ?? "",
    maxPrice: maxPriceQuery ?? "",
  });
}
