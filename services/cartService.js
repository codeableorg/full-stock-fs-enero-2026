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

async function hydrateCart(cart) {
  const products = await productRepository.findAll();

  const cartWithProducts = cart.items.map((item) => {
    const product = products.find((product) => product.id === item.productId);
    if (!product) return null;

    const price = product.price / 100;

    return {
      ...product,
      productId: item.productId,
      product,
      price,
      quantity: item.quantity,
    };
  });

  const enrichedItems = cartWithProducts.filter(Boolean);

  const total = calculateCartTotal(cartWithProducts);

  return { ...cart, items: enrichedItems, total };
}

export async function getCart(cartId) {
  const cart = (await cartRepository.find(cartId)) || { id: cartId, items: [] };
  return cart ? hydrateCart(cart) : null;
}

export function calculateCartTotal(cart) {
  return (cart.items || []).reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

export async function getCartByUserId(userId) {
  const cart = await cartRepository.findByUserId(userId);
  return cart ? hydrateCart(cart) : null;
}

export async function getOrCreateCart(cartId, userId = null) {
  let cart;

  if (cartId) {
    cart = await cartRepository.find(cartId);
  }

  // Si no hallamos el carrito por ID, lo buscamos por userId
  if (!cart && userId) {
    cart = await cartRepository.findByUserId(userId);
  }

  // Si aún no existe, lo creamos vinculado al userId (o null si es visitante)
  if (!cart) {
    cart = await cartRepository.create(userId);
  }

  return cart ? await hydrateCart(cart) : null;
}

export async function addItem(cartId, productId, userId) {
  if (!Number.isInteger(productId)) {
    throw new AppError("Producto inválido", 400);
  }

  const product = await productRepository.find(productId);

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  const cart = await getOrCreateCart(cartId, userId);

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
  return cart;
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

export async function mergeCarts(guestCartId, userId) {
  const guestCart = await cartRepository.find(guestCartId);
  if (!guestCart || guestCart.items.length === 0) return;

  let userCart = await cartRepository.findByUserId(userId);
  if (!userCart) {
    userCart = await cartRepository.create(userId);
  }

  // Lógica de fusión de items
  for (const guestItem of guestCart.items) {
    const existingItem = userCart.items.find(
      (item) => item.productId === guestItem.productId,
    );
    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
    } else {
      userCart.items.push({ ...guestItem });
    }
  }

  await cartRepository.update(userCart);
  // Destruimos el carrito de visitante
  await cartRepository.destroy(guestCartId);
}

export async function clearCart(cartId) {
  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  cart.items = [];

  await cartRepository.update(cart);
}
