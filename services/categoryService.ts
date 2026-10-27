import * as categoryRepository from "../repositories/categoryRepository.ts";

export async function getCategoryBySlug(slug: string) {
  const category = await categoryRepository.findBySlug(slug);
  return category;
}

export async function getAll() {
  const categories = await categoryRepository.findAll();
  return categories;
}
