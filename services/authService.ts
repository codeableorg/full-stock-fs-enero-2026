import * as userService from "./userService.ts";
import * as orderService from "./orderService.ts";
import { AppError } from "../utils/errorUtils.ts";
import { comparePassword, hashPassword } from "../utils/passwordUtils.ts";

export async function signup(
  email: string,
  password: string,
  confirmPassword: string,
) {
  if (password !== confirmPassword) {
    throw new AppError("Las contraseñas no coinciden", 400);
  }

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw new AppError("El correo electrónico ya está registrado", 400);
  }

  const hashedPassword = await hashPassword(password);
  const user = await userService.createUser({
    email,
    password: hashedPassword,
  });

  await orderService.linkPastOrdersToUser(email, user.id);

  return user;
}

export async function login(email: string, password: string) {
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
