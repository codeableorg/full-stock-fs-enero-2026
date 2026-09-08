import * as authService from "../services/authService.ts";
import { clearCookie, setCookie } from "../utils/cookieUtils.ts";
import * as cartService from "../services/cartService.ts";
import type { Request, Response } from "express";

export async function renderSignup(req: Request, res: Response) {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("signup");
}

export async function handleSignup(req: Request, res: Response) {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await authService.signup(email, password, confirmPassword);

    if (req.cartId) {
      await cartService.mergeCarts(req.cartId, user.id);
    }

    setCookie(res, "userId", user.id, { signed: true });
    res.redirect("/");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Algo salió mal...";

    res.render("signup", {
      error: message,
      values: { email },
    });
  }
}

export async function renderLogin(req: Request, res: Response) {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("login");
}

export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    // 1. Delegamos la validación a la capa de servicios
    const user = await authService.login(email, password);

    if (req.cartId) {
      await cartService.mergeCarts(req.cartId, user.id);
    }

    // 2. Si todo sale bien, le entregamos su cookie de identidad
    // Aquí idealizamos una función setCookie que crearemos en breve.
    setCookie(res, "userId", user.id, { signed: true });

    // 3 . Lo llevamos al Home
    res.redirect("/");
  } catch (error) {
    // Si la validación falla (ej. contraseña incorrecta)
    const message =
      error instanceof Error ? error.message : "Algo salió mal...";

    res.render("login", { error: message, values: { email } });
  }
}

export async function handleLogout(_req: Request, res: Response) {
  // Al hacer "Logout", simplemente destruimos la cookie
  clearCookie(res, "userId");
  res.redirect("/");
}
