import type { Session } from "@jcs224/hono-sessions";
import type { Context } from "hono";
import type { SessionDataTypes } from "../index.js";
import { userCheckAuth } from "../middlewares/userCheckAuth.js";
import { db } from "../db.js";
import { deleteCartModel, getCurrentCartId } from "../models/cartModel.js";
import { createOrder, getOrders } from "../models/orderModel.js";
import { getCartDetailByUserId } from "../models/cartModel.js";

type OrderContext = Context<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>;

export async function orderRegister(c: OrderContext) {
  try {
    const authResponse = await userCheckAuth(c);
    if (authResponse) {
      return authResponse;
    }
    const session = c.get("session");
    const userId = session.get("uuid");

    if (!userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    // 現在のカートIDを取得
    const currentCartId = await getCurrentCartId(userId);
    if (!currentCartId) {
      return c.json({ message: "No cart found for the user" }, 400);
    }

    // カート内のアイテムを確認
    const cart = await getCartDetailByUserId(userId);
    if (!cart || !cart.stores || cart.stores.length === 0) {
      return c.json({ message: "Cart is empty" }, 400);
    }

    await db.transaction(async (tx) => {
      // orderの作成
      await createOrder(tx, userId, currentCartId);

      // カートの削除
      await deleteCartModel(tx, userId);
    });

    return c.json({ message: "Order created successfully" }, 201);
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export const getOrderHistory = async (c: OrderContext) => {
  try {
    const authResponse = await userCheckAuth(c);
    if (authResponse) {
      return authResponse;
    }

    const session = c.get("session");
    const userId = session.get("uuid");

    if (!userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    // 注文履歴の取得
    const orderHistory = await getOrders(userId);
    if (!orderHistory) {
      return c.json({ message: "No order history found" }, 404);
    }
    return c.json(orderHistory, 200);
  } catch (error) {
    console.error("Error fetching order history:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};
