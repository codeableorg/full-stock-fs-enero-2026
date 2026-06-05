import * as cartRepository from "../repositories/cartRepository.js";

const CART_COOKIE_NAME = "cartId";

export async function countCartItems(req, res, next) {
  const cartId = req.signedCookies[CART_COOKIE_NAME];
  const cart =
    typeof cartId === "string" ? await cartRepository.find(cartId) : null;
  const items = cart?.items || [];
  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Al guardar el dato en res.locals, estará disponible en TODAS las vistas
  // sin tener que pasarlo manualmente en cada res.render
  res.locals.cartItemsCount = cartItemsCount;

  // Es fundamental llamar a next() para que la petición siga su curso hacia las rutas
  next();
}
