import * as categoryRepository from "../repositories/categoryRepository.ts";

export async function getCategoryBySlug(slug: string) {
  const category = await categoryRepository.findBySlug(slug);
  return category;
}
