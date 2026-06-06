import crypto from "node:crypto";
import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";
import { AppError } from "../utils/errorUtils.js";

export async function findCart(cartId) {
  return cartRepository.find(cartId);
}

export async function createCart() {
  const cart = {
    id: crypto.randomUUID(),
    items: [],
  };

  return cartRepository.create(cart);
}

export async function getCart(cartId) {
  const cart = (await cartRepository.find(cartId)) || { id: cartId, items: [] };
  const items = cart.items || [];

  const cartProducts = items.map(async (item) => {
    // todo migrar a usar product service
    const product = await productRepository.find(item.productId);

    if (!product) return null;

    return {
      ...product,
      price: Number(product.price) / 100,
      quantity: item.quantity,
    };
  });

  const products = await Promise.all(cartProducts);

  return {
    ...cart,
    items: products.filter(Boolean),
  };
}

export function calculateCartTotal(cart) {
  return (cart.items || []).reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

export async function addItem(cartId, productId) {
  if (!Number.isInteger(productId)) {
    throw new AppError("Producto inválido", 400);
  }

  const product = await productRepository.find(productId);

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  const cart = await cartRepository.find(cartId);

  if (!cart) {
    throw new AppError("Carrito no encontrado", 404);
  }

  const items = cart.items || [];
  const productItem = items.find((item) => item.productId === productId);

  if (productItem) {
    productItem.quantity += 1;
  } else {
    items.push({ productId, quantity: 1 });
    cart.items = items;
  }

  await cartRepository.update(cart);
}

export async function updateItem(cartId, productId, action) {
  if (!Number.isInteger(productId)) {
    throw new AppError("Producto inválido", 400);
  }

  if (action !== "increase" && action !== "decrease") {
    throw new AppError("Acción no reconocida", 422);
  }

  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  const items = cart.items || [];

  if (items.length === 0) return;

  const itemIndex = items.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) return;

  const quantityChange = action === "increase" ? 1 : -1;
  const item = items[itemIndex];
  const nextQuantity = item.quantity + quantityChange;

  if (nextQuantity <= 0) {
    items.splice(itemIndex, 1);
  } else {
    item.quantity = nextQuantity;
  }

  await cartRepository.update(cart);
}

export async function deleteItem(cartId, productId) {
  if (!Number.isInteger(productId)) {
    throw new AppError("Producto inválido", 400);
  }

  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  const items = cart.items || [];

  if (items.length === 0) return;

  cart.items = items.filter((item) => item.productId !== productId);

  await cartRepository.update(cart);
}
