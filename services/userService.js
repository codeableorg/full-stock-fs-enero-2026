import * as userRepository from "../repositories/userRepository.ts";

export async function getUserByEmail(email) {
  return await userRepository.findByEmail(email);
}

export async function createUser(userData) {
  return await userRepository.create(userData);
}

export async function getUserById(userId) {
  return await userRepository.findById(userId);
}
