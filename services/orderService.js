import * as cartService from "./cartService.js";
import * as orderRepository from "../repositories/orderRepository.js";
import { AppError } from "../utils/errorUtils.js";

export async function processCheckout(shippingInfo, cartId) {
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
  const order = {
    items,
    shippingInfo,
    total: cart.total,
  };
  const newOrder = await orderRepository.create(order);

  await cartService.clearCart(cartId);

  return newOrder;
}

export async function getOrderById(id) {
  return orderRepository.findById(id);
}
