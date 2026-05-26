import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.join("data", "data.json");

export async function categoryHandler(req, res) {
  const { slug } = req.params;
  const dataJson = await fs.readFile(DATA_PATH, "utf-8");

  const data = JSON.parse(dataJson);
  const category = data.categories.find((category) => category.slug === slug);
  const products = data.products.filter(
    (product) => product.categoryId === category.id,
  );

  res.render("category", { category, products });
}
