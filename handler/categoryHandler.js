import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.join("data", "data.json");

export async function categoryHandler(req, res) {
  const { slug } = req.params;
  const { minPrice: minPriceQuery, maxPrice: maxPriceQuery } = req.query;

  const minPrice = minPriceQuery ? Number(minPriceQuery) * 100 : -Infinity;
  const maxPrice = maxPriceQuery ? Number(maxPriceQuery) * 100 : Infinity;

  const dataJson = await fs.readFile(DATA_PATH, "utf-8");

  const data = JSON.parse(dataJson);
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
