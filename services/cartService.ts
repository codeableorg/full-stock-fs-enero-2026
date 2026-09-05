import crypto from "node:crypto";
import * as cartRepository from "../repositories/cartRepository.ts";
import * as productRepository from "../repositories/productRepository.ts";
import { AppError } from "../utils/errorUtils.ts";
import type { Cart } from "../types/index.ts";

interface HydrateCartItem {
  productId: number;
  imgSrc: string;
  alt: string;
  name: string;
  price: number;
  quantity: number;
}

export interface HydrateCart extends Omit<Cart, "items"> {
  items: HydrateCartItem[];
  total: number;
}

export async function findCart(cartId: number) {
  return cartRepository.find(cartId);
}

// Todo: analizar si se puede reforzar tipado
async function hydrateCart(cart: Cart): Promise<HydrateCart> {
  const products = await productRepository.findAll();

  const cartWithProducts = cart.items.map((item): HydrateCartItem | null => {
    const product = products.find((product) => product.id === item.productId);
    if (!product) return null;

    const price = product.price / 100;

    return {
      imgSrc: product.imgSrc,
      alt: product.description,
      name: product.name,
      productId: item.productId,
      price,
      quantity: item.quantity,
    };
  });

  const enrichedItems = cartWithProducts.filter((item) => item !== null);

  const total = calculateCartTotal({ items: enrichedItems });

  return { ...cart, items: enrichedItems, total };
}

// todo: Revisar si esta logica es totalmente necesario o reduce lineas de codigo
// ? Revisar si se puede remover Cart por si rompe otras partes de la app
function toPersistable(cart: Cart): Cart {
  return {
    id: cart.id,
    userId: cart.userId ?? null,
    items: (cart.items || []).map(({ productId, quantity }) => ({
      productId,
      quantity,
    })),
  };
}

export async function getCart(cartId: number) {
  const cart = (await cartRepository.find(cartId)) || { id: cartId, items: [] };
  return hydrateCart(cart);
}

export function calculateCartTotal(cart: { items: HydrateCartItem[] }) {
  return (cart.items || []).reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

export async function getCartByUserId(userId: number) {
  const cart = await cartRepository.findByUserId(userId);
  return cart ? hydrateCart(cart) : null;
}

export async function getOrCreateCart(
  cartId: number | null,
  userId: number | null = null,
) {
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

  return cart ?? null;
}

export async function addItem(
  cartId: number | null,
  productId: number,
  userId: number | null,
) {
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

  await cartRepository.update(toPersistable(cart));
  return cart;
}

export async function updateItem(
  cartId: number,
  productId: number,
  action: string,
) {
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

  await cartRepository.update(toPersistable(cart));
}

export async function deleteItem(cartId: number, productId: number) {
  if (!Number.isInteger(productId)) {
    throw new AppError("Producto inválido", 400);
  }

  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  const items = cart.items || [];

  if (items.length === 0) return;

  cart.items = items.filter((item) => item.productId !== productId);

  await cartRepository.update(toPersistable(cart));
}

export async function mergeCarts(guestCartId: number, userId: number) {
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

  await cartRepository.update(toPersistable(userCart));
  // Destruimos el carrito de visitante
  await cartRepository.destroy(guestCartId);
}

export async function clearCart(cartId: number) {
  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  cart.items = [];

  await cartRepository.update(toPersistable(cart));
}
