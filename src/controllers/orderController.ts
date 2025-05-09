import { userCheckAuth } from "../middlewares/userCheckAuth.js";
import { db } from "../db.js";
import { deleteCartModel, getCurrentCartId } from "../models/cartModel.js";
import {
  createCompleteOrderStatus,
  createOrder,
  getAvailableOrders,
  getOrders,
} from "../models/orderModel.js";
import { getCartDetailByUserId } from "../models/cartModel.js";
import { crewCheckAuth } from "../middlewares/crewCheckAuth.js";
import type { AuthContext } from "../types/context.js";

export async function orderRegister(c: AuthContext) {
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

export const getOrderHistory = async (c: AuthContext) => {
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

export const orderComplete = async (c: AuthContext) => {
  try {
    const authResponse = await crewCheckAuth(c);
    if (authResponse) {
      return authResponse;
    }

    const session = c.get("session");
    const crewId = session.get("uuid");

    if (!crewId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const orderId: number = Number(c.req.param("orderId"));

    if (isNaN(orderId)) {
      return c.json({ message: "Invalid order ID" }, 400);
    }

    await createCompleteOrderStatus(crewId, orderId);
    return c.json({ message: "Order completed successfully" }, 200);
  } catch (error) {
    console.error("Error fetching order history:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};

export const orderAvailable = async (c: AuthContext) => {
  try {
    const authResponse = await crewCheckAuth(c);
    if (authResponse) {
      return authResponse;
    }
    const session = c.get("session");
    const crewId = session.get("uuid");
    if (!crewId) {
      return c.json({ message: "Unauthorized3" }, 401);
    }

    const orders = await getAvailableOrders();
    if (!orders) {
      return c.json({ message: "No available orders" }, 404);
    }
    return c.json(orders, 200);
  } catch (error) {
    console.error("Error fetching available orders:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};
