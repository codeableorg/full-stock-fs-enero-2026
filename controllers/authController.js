import * as authService from "../services/authService.js";
import { clearCookie, setCookie } from "../utils/cookieUtils.js";

export async function renderSignup(req, res) {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("signup");
}

export async function handleSignup(req, res) {
  const { email, password, confirmPassword } = req.body;

  try {
    await authService.signup(email, password, confirmPassword);
    res.redirect("/");
  } catch (error) {
    res.render("signup", {
      error: error.message,
      values: { email },
    });
  }
}

export async function renderLogin(req, res) {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("login");
}

export async function handleLogin(req, res) {
  const { email, password } = req.body;

  try {
    // 1. Delegamos la validación a la capa de servicios
    const user = await authService.login(email, password);

    // 2. Si todo sale bien, le entregamos su cookie de identidad
    // Aquí idealizamos una función setCookie que crearemos en breve.
    setCookie(res, "userId", user.id);

    // 3. Lo llevamos al Home
    res.redirect("/");
  } catch (error) {
    // Si la validación falla (ej. contraseña incorrecta)
    res.render("login", { error: error.message, values: { email } });
  }
}

export async function handleLogout(_req, res) {
  // Al hacer "Logout", simplemente destruimos la cookie
  clearCookie(res, "userId");
  res.redirect("/");
}
