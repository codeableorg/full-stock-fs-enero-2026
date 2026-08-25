import type { CookieOptions, Request, Response } from "express";

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

export function setCookie(
  res: Response,
  name: string,
  value: number,
  options: CookieOptions = {},
) {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    maxAge: ONE_WEEK,
    sameSite: "lax",
    signed: true,
  };

  // Combinamos las opciones por defecto con las que decida enviar el usuario.
  res.cookie(name, value, { ...defaultOptions, ...options });
}

export function getCookie(
  req: Request,
  name: string,
): string | false | undefined {
  return req.signedCookies[name];
}

export function clearCookie(res: Response, name: string) {
  res.clearCookie(name);
}
