import { DATA_PATH, readDataFile } from "../utils/handlerUtils.js";
import fs from "node:fs/promises";
// Función escrita con síntaxis flecha por fines educativos
// Se debería respetar el formato de escritura de funciones global
// Ver el resto de handlers.

export const cartHandler = async (req, res) => {
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
