import { DATA_PATH, readDataFile } from "../utils.js";
import fs from "node:fs/promises";
// Función escrita con síntaxis flecha por fines educativos
// Se debería respetar el formato de escritura de funciones global
// Ver el resto de handlers.

export const cartHandler = async (req, res) => {
  const { body } = req;
  const { productId } = body;

  const data = await readDataFile();

  const product = data.products.find(
    (product) => product.id === Number(productId),
  );

  if (!product) {
    return res.status(404).render("404");
  }

  if (data.carts.length === 0) {
    data.carts = [
      {
        id: 1,
        items: [
          {
            productId: product.id,
            quantity: 1,
          },
        ],
      },
    ];
  } else {
    const cart = data.carts[0];
    const productIndex = cart.items.findIndex(
      (item) => item.productId === Number(productId),
    );

    if (productIndex !== -1) {
      cart.items[productIndex] = {
        ...cart.items[productIndex],
        quantity: cart.items[productIndex].quantity + 1,
      };
    } else {
      cart.items.push({ productId: Number(productId), quantity: 1 });
    }
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

  res.redirect("/cart");
};
