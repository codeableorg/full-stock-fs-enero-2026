import type { Request, Response } from "express";
import * as orderService from "../services/orderService.ts";
import { AppError } from "../utils/errorUtils.ts";

export async function renderCheckout(req: Request, res: Response) {
  const cart = req.cart || { items: [], total: 0 };

  res.render("checkout", {
    cartItems: cart.items,
    total: cart.total ?? 0,
  });
}

export async function placeOrder(req: Request, res: Response) {
  const shippingInfo = req.body;
  const cartId = req.cartId;

  if (!cartId) {
    throw new AppError("No puedes crear una orden con el carrito vacío", 400);
  }

  const newOrder = await orderService.processCheckout(shippingInfo, cartId);

  res.redirect(`/checkout/order-confirmation?orderId=${newOrder.id}`);
}

export async function renderOrderConfirmation(req: Request, res: Response) {
  const orderId = Number(req.query.orderId);

  if (!orderId) {
    throw new AppError("El número de orden no es válido", 400);
  }

  const order = await orderService.getOrderById(orderId);

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  res.render("order-confirmation", { orderId });
}
