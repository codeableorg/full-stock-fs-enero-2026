import * as userRepository from "../repositories/userRepository.ts";
import type { User } from "../types/index.ts";

export async function getUserByEmail(email: string) {
  return await userRepository.findByEmail(email);
}

export async function createUser(userData: Omit<User, "id">) {
  return await userRepository.create(userData);
}

export async function getUserById(userId: number) {
  return await userRepository.findById(userId);
}
