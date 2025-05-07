
import type { Session } from "@jcs224/hono-sessions";
import type { Context } from "hono";
import { db } from "../db.js";
import type { SessionDataTypes } from "../index.js";
import { userCheckAuth } from "../middlewares/userCheckAuth.js";
import { createcartItems } from "../models/cartItemModel.js";
import { createCart, hasValidCart } from "../models/cartModel.js";
import { getItemDetailsByIds } from "../models/itemModel.js";

type CartContext = Context<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>;

export async function cartRegister(c: CartContext) {
  try {
  const authResponse = await userCheckAuth(c);
  if (authResponse) {
    return authResponse;
  }
  const session = c.get("session");
  const userId = session.get("uuid");

  // ユーザーIDが取得できない場合は401エラーを返す
  if (!userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  // カートが存在するか確認
  const hasCart = await hasValidCart(userId)
  if (hasCart) {
    return c.json({ message: "User already has a cart" }, 400);
  }

  await db.transaction(async (tx) => {

  // カートの作成
  const cartId = await createCart(tx, userId);

  const body = await c.req.json();
  const requestItems = body.items as Array<{ itemId: string; quantity: number }>;
  const itemIds = requestItems.map((item) => Number(item.itemId));

  const items = await getItemDetailsByIds(itemIds);

  const quantityMap = Object.fromEntries(
    requestItems.map((item) => [item.itemId, item.quantity])
  );

  const merged = items.map((item) => ({
    ...item,
    quantity: quantityMap[item.itemId] ?? 0,
  }));

  await createcartItems(tx, cartId, merged);
  });
  return c.json({ message: "Cart created successfully" }, 201);

  } catch (error) {
    console.error("Error in cartRegister:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}