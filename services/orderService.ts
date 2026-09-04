import * as cartService from "./cartService.ts";
import * as userService from "./userService.ts";
import * as orderRepository from "../repositories/orderRepository.ts";
import { AppError } from "../utils/errorUtils.ts";
import type { ShippingInfo } from "../types/index.ts";

export async function processCheckout(
  shippingInfo: ShippingInfo,
  cartId: number,
  userId: number | null = null,
) {
  const cart = await cartService.getCart(cartId);

  if (!cart || cart.items.length === 0) {
    throw new AppError("No puedes crear una orden con el carrito vacío", 400);
  }

  const items = cart.items.map((item) => ({
    productId: item.productId,
    name: item.name,
    price: item.price * 100,
    imgSrc: item.imgSrc,
    quantity: item.quantity,
  }));

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (!userId) {
    const user = await userService.getUserByEmail(shippingInfo.email);
    if (user) userId = user.id;
  }

  const order = {
    userId,
    items,
    shippingInfo,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const newOrder = await orderRepository.create(order);

  await cartService.clearCart(cartId);

  return newOrder;
}

export async function getOrderById(id: number) {
  return orderRepository.findById(id);
}

export async function linkPastOrdersToUser(email: string, userId: number) {
  return orderRepository.updateUserIdByEmail(email, userId);
}
