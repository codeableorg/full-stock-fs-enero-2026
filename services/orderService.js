import * as cartService from "./cartService.js";
import * as userService from "./userService.js";
import * as orderRepository from "../repositories/orderRepository.js";
import { AppError } from "../utils/errorUtils.ts";

export async function processCheckout(shippingInfo, cartId, userId = null) {
  const cart = await cartService.getCart(cartId);

  if (!cart || cart.items.length === 0) {
    throw new AppError("No puedes crear una orden con el carrito vacío", 400);
  }

  const items = cart.items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    imgSrc: item.product.imgSrc,
    quantity: item.quantity,
  }));

  if (!userId) {
    const user = await userService.getUserByEmail(shippingInfo.email);
    if (user) userId = user.id;
  }

  const order = {
    userId,
    items,
    shippingInfo,
    total: cart.total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const newOrder = await orderRepository.create(order);

  await cartService.clearCart(cartId);

  return newOrder;
}

export async function getOrderById(id) {
  return orderRepository.findById(id);
}

export async function linkPastOrdersToUser(email, userId) {
  return orderRepository.updateUserIdByEmail(email, userId);
}
