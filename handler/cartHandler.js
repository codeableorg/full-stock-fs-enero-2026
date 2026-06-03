import { DATA_PATH, readDataFile } from "../utils/handlerUtils.js";
import { AppError } from "../utils/errorUtils.js";
import fs from "node:fs/promises";
// Función escrita con síntaxis flecha por fines educativos
// Se debería respetar el formato de escritura de funciones global
// Ver el resto de handlers.

export const addCartHandler = async (req, res) => {
  const { body } = req;
  const { productId } = body;

  const data = await readDataFile();

  const parsedProductId = Number(productId);

  const product = data.products.find(
    (product) => product.id === parsedProductId,
  );

  if (!product) {
    return res.status(404).render("404");
  }

  const cart = data.carts[0] || { id: 1, items: [] };

  const productItem = cart.items.find(
    (item) => item.productId === parsedProductId,
  );

  if (productItem) {
    productItem.quantity += 1;
  } else {
    cart.items.push({ productId: parsedProductId, quantity: 1 });
  }

  data.carts[0] = cart;

  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

  res.redirect("/cart");
};

export const getCartHandler = async (req, res) => {
  const data = await readDataFile();

  const cartItems = data.carts[0]?.items || [];

  // todo: manejar productos que ya no existen en data
  const cartProducts = cartItems.map((item) => {
    const product = data.products.find(
      (product) => product.id === item.productId,
    );
    return {
      ...product,
      price: Number(product.price) / 100,
      quantity: item.quantity,
    };
  });

  const cartTotal = cartProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );
  res.render("cart", { cart: cartProducts, cartTotal });
};

export async function editCartHandler(req, res) {
  const { id } = req.params;
  const { action } = req.body;

  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    throw new AppError("Producto inválido", 400);
  }

  if (action !== "increase" && action !== "decrease") {
    throw new AppError("Acción inválida", 400);
  }

  const data = await readDataFile();

  const cartItems = data.carts[0]?.items;

  if (!cartItems) {
    return res.redirect("/cart");
  }

  const productIndex = cartItems.findIndex(
    (item) => item.productId === productId,
  );

  if (productIndex === -1) {
    return res.redirect("/cart");
  }

  const quantityChange = action === "increase" ? 1 : -1;
  const cartItem = cartItems[productIndex];
  const nextQuantity = cartItem.quantity + quantityChange;

  if (nextQuantity <= 0) {
    cartItems.splice(productIndex, 1);
  } else {
    cartItem.quantity = nextQuantity;
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

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
