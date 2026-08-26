import * as cartService from "../services/cartService.js";
import { setCookie } from "../utils/cookieUtils.ts";
// Función escrita con síntaxis flecha por fines educativos
// Se debería respetar el formato de escritura de funciones global
// Ver el resto de controllers.

export const renderCart = async (req, res) => {
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
