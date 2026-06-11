import * as userService from "./userService.js";
import { AppError } from "../utils/errorUtils.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";

export async function signup(email, password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new AppError("Las contraseñas no coinciden", 400);
  }

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw new AppError("El correo electrónico ya está registrado", 400);
  }

  const hashedPassword = await hashPassword(password);
  return await userService.createUser({
    email,
    password: hashedPassword,
  });
}

export async function login(email, password) {
  // 1. Buscamos al usuario por correo
  const user = await userService.getUserByEmail(email);
  if (!user) {
    // Si no existe, lanzamos error genérico por seguridad
    throw new AppError("Credenciales inválidas", 401);
  }

  // 2. Comparamos las contraseñas
  const isPasswordValid = await comparePassword(password, user.password);

  // 3. Si no coincide, devolvemos exactamente el mismo error
  if (!isPasswordValid) {
    throw new AppError("Credenciales inválidas", 401);
  }

  // Si pasa todo, devolvemos el usuario al controlador
  return user;
}
