import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";
import { AppError } from "../utils/errorUtils.js";

export async function getCart() {
  const cart = await cartRepository.getCart();
  const items = cart.items || [];

  // todo: manejar productos que ya no existen en data
  const cartProducts = items.map(async (item) => {
    // todo migrar a usar product service
    const product = await productRepository.find(item.productId);

    return {
      ...product,
      price: Number(product.price) / 100,
      quantity: item.quantity,
    };
  });

  console.log(cartProducts);

  cart.items = await Promise.all(cartProducts);
  return cart;
}

export function calculateCartTotal(cart) {
  return cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

export async function addItem(productId) {
  const product = await productRepository.find(productId);

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  const cart = await cartRepository.getCart();
  const items = cart.items || [];
  const productItem = items.find((item) => item.productId === productId);

  if (productItem) {
    productItem.quantity += 1;
  } else {
    items.push({ productId, quantity: 1 });
    cart.items = items;
  }

  await cartRepository.updateCart(cart);
}

export async function updateItem(productId, action) {
  if (action !== "increase" && action !== "decrease") {
    throw new AppError("Acción no reconocida", 422);
  }

  const cart = await cartRepository.getCart();
  const items = cart.items || [];

  if (items.length === 0) return;

  const itemIndex = items.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) return;

  const quantityChange = action === "increase" ? 1 : -1;
  const item = items[itemIndex];
  item.quantity += quantityChange;

  if (item.quantity <= 0) items.splice(itemIndex, 1);

  await cartRepository.updateCart(cart);
}

export async function deleteItem(productId) {
  const cart = await cartRepository.getCart();
  const items = cart.items || [];

  if (items.length === 0) return;

  const itemIndex = items.find((item) => item.productId === productId);

  if (itemIndex === -1) return;

  items.splice(itemIndex, 1);

  await cartRepository.updateCart(cart);
}
