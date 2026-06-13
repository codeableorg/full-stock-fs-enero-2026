import * as userService from "../services/userService.js";
import { clearCookie } from "../utils/cookieUtils.js";

export async function authContext(req, res, next) {
  // 1. Valores por defecto (asumimos que nadie está logueado al inicio)
  req.user = null;
  res.locals.user = null;

  // 2. Leemos la cookie. Si no existe, usamos el patrón "Early Return"
  const userId = req.signedCookies.userId;

  if (userId === false) {
    clearCookie(res, "userId");
  }

  if (!userId) {
    return next(); // "No hay cookie de usuario, salimos de este middleware"
  }

  // 3. Si hay cookie, buscamos la entidad completa del usuario
  const user = await userService.getUserById(Number(userId));

  // 4. Si no existe el usuario, limpiamos la cookie y salimos
  if (!user) {
    clearCookie(res, "userId");
    return next();
  }

  // 5. ¡Éxito! Asignamos el usuario a la petición actual.
  req.user = user; // Para que los controladores futuros puedan usar req.user
  res.locals.user = user; // Para que quede disponible para todas las vistas EJS

  next();
}
