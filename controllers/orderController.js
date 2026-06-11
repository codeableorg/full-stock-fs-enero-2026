import * as cartService from "../services/cartService.js";
import * as orderService from "../services/orderService.js";
import { AppError } from "../utils/errorUtils.js";

const CART_COOKIE_NAME = "cartId";

function getCartId(req) {
  const cartId = req.signedCookies[CART_COOKIE_NAME];
  return typeof cartId === "string" ? cartId : null;
}

export async function renderCheckout(req, res) {
  const cartId = getCartId(req);
  const cart = cartId ? await cartService.getCart(cartId) : null;
  const checkoutCart = cart || { items: [], total: 0 };

  res.render("checkout", {
    cartItems: checkoutCart.items,
    total: checkoutCart.total,
  });
}

export async function placeOrder(req, res) {
  const shippingInfo = req.body;
  const cartId = getCartId(req);
  const newOrder = await orderService.processCheckout(shippingInfo, cartId);

  res.redirect(`/checkout/order-confirmation?orderId=${newOrder.id}`);
}

export async function renderOrderConfirmation(req, res) {
  const orderId = Number(req.query.orderId);

  if (!orderId) {
    throw new AppError("El número de orden no es válido", 400);
  }

  const order = await orderService.getOrderById(orderId);

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  res.render("order-confirmation", { orderId });
}
