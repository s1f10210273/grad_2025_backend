import type { Session } from "@jcs224/hono-sessions";
import type { Context } from "hono";
import type { SessionDataTypes } from "../index.js";
import { userCheckAuth } from "../middlewares/userCheckAuth.js";
import { db } from "../db.js";
import { getCurrentCart } from "../models/cartModel.js";

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

    await db.transaction(async (tx) => {
      const currentCartId = await getCurrentCart(userId);

      // カートが存在しない場合は404エラーを返す
      if (!currentCartId) {
        return c.json({ message: "No cart found for the user" }, 400);
      }
      //todo: オーダーを作成
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}
