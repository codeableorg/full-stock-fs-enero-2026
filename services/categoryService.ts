import * as categoryRepository from "../repositories/categoryRepository.ts";

export async function getCategoryBySlug(slug: string) {
  const categories = await categoryRepository.findAll();
  return categories.find((category) => category.slug === slug);
}
