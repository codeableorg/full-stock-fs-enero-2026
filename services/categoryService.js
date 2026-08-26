import * as categoryRepository from "../repositories/categoryRepository.ts";

export async function getCategoryBySlug(slug) {
  const categories = await categoryRepository.findAll();
  return categories.find((category) => category.slug === slug);
}
