import * as cartService from "../services/cartService.js";
// Función escrita con síntaxis flecha por fines educativos
// Se debería respetar el formato de escritura de funciones global
// Ver el resto de controllers.
export const renderCart = async (req, res) => {
  const cart = await cartService.getCart();

  const cartTotal = cartService.calculateCartTotal(cart);

  res.render("cart", { cart, cartTotal });
};

export const addItem = async (req, res) => {
  const { body } = req;
  const { productId } = body;

  await cartService.addItem(Number(productId));
  res.send("Todo ok");
  // res.redirect("/cart");
};

export async function updateItem(req, res) {
  const { productId, action } = req.body;

  await cartService.updateItem(Number(productId), action);

  res.redirect("/cart");
}

export async function deleteItem(req, res) {
  const { productId } = req.body;

  await cartService.deleteItem(Number(productId));

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
