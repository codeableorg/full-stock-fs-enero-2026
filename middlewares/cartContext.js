import { clearCookie } from "../utils/cookieUtils.js";

export function cartContext(req, res, next) {
  // 1. Lee la cookie 'cartId'
  const cartIdCookie = req.signedCookies.cartId;

  if (cartIdCookie === false) {
    clearCookie(res, "cartId");
  }
  // 2. Si existe, conviértela a número y guárdala en req.cartId
  // Si no existe, req.cartId será null
  req.cartId = cartIdCookie ? cartIdCookie : null;

  next();
}
