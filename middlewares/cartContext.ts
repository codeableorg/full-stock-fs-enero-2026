import { clearCookie, getCookie } from "../utils/cookieUtils.ts";
import * as cartService from "../services/cartService.ts";
import type { NextFunction, Request, Response } from "express";

const injectCart = (
  req: Request,
  res: Response,
  cart: cartService.HydrateCart | null,
) => {
  if (!cart) return;
  req.cart = cart;
  req.cartId = cart.id;

  res.locals.cartItemsCount = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
};

export async function cartContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // 1. Lee la cookie 'cartId'
  const cartIdCookie = getCookie(req, "cartId");

  req.cart = null;
  req.cartId = null;
  res.locals.cartItemsCount = 0;

  // Caso 1: Usuario autenticado → buscamos por userId en DB
  if (req.user) {
    if (cartIdCookie !== undefined) clearCookie(res, "cartId");
    const cart = await cartService.getCartByUserId(req.user.id);
    injectCart(req, res, cart);
    return next();
  }

  // Caso 2: Cookie corrompida → la limpiamos y seguimos
  if (cartIdCookie === false) {
    clearCookie(res, "cartId");
    return next();
  }

  // Caso 3: No hay cookie → el visitante no tiene carrito aún
  if (!cartIdCookie) return next();

  // Caso 4: Visitante con cookie → buscamos el carrito en DB
  const cart = await cartService.getCart(Number(cartIdCookie));
  if (!cart) {
    clearCookie(res, "cartId"); // La cookie apunta a un carrito que ya no existe
  } else {
    injectCart(req, res, cart);
  }

  next();
}
