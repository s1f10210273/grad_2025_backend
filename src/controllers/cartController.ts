import type { Session } from "@jcs224/hono-sessions";
import type { Context } from "hono";
import { db } from "../db.js";
import type { SessionDataTypes } from "../index.js";
import { userCheckAuth } from "../middlewares/userCheckAuth.js";
import {
  createcartItems,
  deleteMissingCartItems,
  fetchExistingCartItemIds,
  insertNewCartItems,
} from "../models/cartItemModel.js";
import {
  createCart,
  getCartDetailByUserId,
  getCurrentCart,
  hasValidCart,
} from "../models/cartModel.js";
import { getItemDetailsByIds } from "../models/itemModel.js";
import type { CartRegisterApi } from "../schemas/cartItem.js";

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
    const hasCart = await hasValidCart(userId);
    if (hasCart) {
      return c.json({ message: "User already has a cart" }, 400);
    }

    await db.transaction(async (tx) => {
      // カートの作成
      const cartId = await createCart(tx, userId);

      const body = await c.req.json();
      const requestItems = body.items as Array<{
        itemId: string;
        quantity: number;
      }>;
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

export async function getCarts(c: CartContext) {
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

    // カートの取得
    const cart = await getCartDetailByUserId(userId);

    return c.json(cart, 200);
  } catch (error) {
    console.error("Error in cartGet:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function updateCarts(c: CartContext) {
  try {
    const authResponse = await userCheckAuth(c);
    if (authResponse) {
      return authResponse;
    }

    const validatedItems = await validateItems(c);
    if (!("items" in validatedItems)) {
      return validatedItems;
    }

    const session = c.get("session");
    const userId = session.get("uuid");

    // ユーザーIDが取得できない場合は401エラーを返す
    if (!userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    // カートが存在するか確認
    const cart = await getCurrentCart(userId);
    if (!cart) {
      return c.json({ message: "Cart not found for the user" }, 404);
    }

    await db.transaction(async (tx) => {
      await updateCartItems(tx, c, cart.id, validatedItems.items);

      const deleteItems = validatedItems.items.map(({ itemId, quantity }) => ({
        itemId,
        quantity,
      }));
      // カートアイテムの削除処理を追加
      await deleteMissingCartItems(tx, cart.id, deleteItems);

      // 新しいアイテムの追加処理を追加
      await addNewCartItems(tx, cart.id, validatedItems.items);
    });
    return c.json({ message: "Cart updated successfully" }, 200);
  } catch (error) {
    console.error("Error in putCarts:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export const validateItems = async (c: CartContext) => {
  const body = await c.req.json();
  const items = body.items as Array<{
    itemId: string;
    quantity: number;
  }>;
  if (items.length === 0) {
    return c.json({ message: "No items provided in the request" }, 400);
  }

  const itemIds = items.map((item) => Number(item.itemId));
  const itemDetails = await getItemDetailsByIds(itemIds);

  if (itemDetails.length !== itemIds.length) {
    return c.json({ message: "Some item IDs are invalid" }, 400);
  }

  const itemDetailsMap = new Map(
    itemDetails.map((item) => [
      item.itemId,
      { name: item.itemName, price: item.itemPrice, storeId: item.storeId },
    ])
  );

  const enrichedItems = items.map((item) => {
    const details = itemDetailsMap.get(Number(item.itemId));
    if (!details) {
      throw new Error(`Item with ID ${item.itemId} not found`);
    }
    return {
      itemId: Number(item.itemId),
      itemName: details.name,
      itemPrice: details.price,
      storeId: details.storeId,
      quantity: item.quantity,
    };
  });

  return { items: enrichedItems };
};

export const updateCartItems = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  c: CartContext,
  cartId: number,
  items: CartRegisterApi[]
) => {
  const itemIds = items.map((item) => Number(item.itemId));
  const itemDetails = await getItemDetailsByIds(itemIds);
  if (itemDetails.length !== itemIds.length) {
    return c.json({ message: "Some item IDs are invalid" }, 400);
  }
  const itemDetailsMap = new Map(
    itemDetails.map((item) => [
      item.itemId,
      { name: item.itemName, price: item.itemPrice, storeId: item.storeId },
    ])
  );
  const enrichedItems = items.map((item) => {
    const details = itemDetailsMap.get(Number(item.itemId));
    if (!details) {
      throw new Error(`Item with ID ${item.itemId} not found`);
    }
    return {
      itemId: Number(item.itemId),
      itemName: details.name,
      itemPrice: details.price,
      quantity: item.quantity,
      storeId: details.storeId,
    };
  });
  await createcartItems(tx, cartId, enrichedItems);

  return c.json({ message: "Cart updated successfully" }, 200);
};

export const addNewCartItems = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  cartId: number,
  items: CartRegisterApi[]
) => {
  try {
    // Set を使って存在するアイテムのIDを取得
    const existingItemIds = new Set(
      await fetchExistingCartItemIds(
        tx,
        cartId,
        items.map((i) => i.itemId)
      )
    );
    // 存在しないアイテムだけをフィルタリング
    const newItems = items.filter((item) => !existingItemIds.has(item.itemId));
    if (newItems.length > 0) {
      await insertNewCartItems(tx, cartId, newItems);
    }
  } catch (error) {
    console.error("Error adding new cart items:", error);
    throw new Error("Failed to add new cart items");
  }
};
