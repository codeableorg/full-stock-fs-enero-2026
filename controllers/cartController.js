import * as cartService from "../services/cartService.js";
import { setCookie } from "../utils/cookieUtils.js";
// Función escrita con síntaxis flecha por fines educativos
// Se debería respetar el formato de escritura de funciones global
// Ver el resto de controllers.

const CART_COOKIE_NAME = "cartId";

const CART_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: true,
  signed: true,
};

async function getOrCreateCart(req, res) {
  const cartId = req.cartId;
  const cart = cartId ? await cartService.findCart(cartId) : null;

  if (cart) return cart;

  const newCart = await cartService.createCart();
  setCookie(res, CART_COOKIE_NAME, newCart.id, CART_COOKIE_OPTIONS);

  return newCart;
}

export const renderCart = async (req, res) => {
  // const currentCart = await getOrCreateCart(req, res);
  // const cart = await cartService.getCart(currentCart.id);

  // const cartTotal = cartService.calculateCartTotal(cart);
  const cart = req.cart || { items: [], total: 0 };
  cart.total = cartService.calculateCartTotal(cart);
  res.render("cart", { cartItems: cart.items, total: cart.total });
};

export const addItem = async (req, res) => {
  const { body } = req;
  const { productId } = body;
  const userId = req.user?.id;

  const cart = await cartService.addItem(req.cartId, Number(productId), userId);

  if (!req.user && cart.id !== req.cartId) {
    setCookie(res, "cartId", cart.id);
  }
  res.redirect("/cart");
};

export async function updateItem(req, res) {
  const { productId, action } = req.body;
  const cartId = req.cartId;

  if (cartId) {
    await cartService.updateItem(cartId, Number(productId), action);
  }

  res.redirect("/cart");
}

export async function deleteItem(req, res) {
  const { productId } = req.body;
  const cartId = req.cartId;

  if (cartId) {
    await cartService.deleteItem(cartId, Number(productId));
  }

  res.redirect("/cart");
}

// function addToCart(cart, parsedProductId) {
//   const newCart = cart ? { ...cart } : { id: 1, items: [] };

//   const productItem = newCart.items.find(
//     (item) => item.productId === parsedProductId,
//   );

//   newCart.items = productItem
//     ? newCart.items.map((item) => {
//         if (item.productId === parsedProductId) {
//           return {
//             ...item,
//             quantity: item.quantity + 1,
//           };
//         }
//         return item;
//       })
//     : [...newCart.items, { productId: parsedProductId, quantity: 1 }];

//   return newCart;
// }
