import { db } from "../db.js";
import { userCheckAuth } from "../middlewares/userCheckAuth.js";
import {
  createcartItems,
  deleteCartItemModel,
  deleteMissingCartItems,
  fetchExistingCartItemIds,
  insertNewCartItems,
} from "../models/cartItemModel.js";
import {
  createCart,
  deleteCartModel,
  getCartDetailByUserId,
  getCurrentCart,
  hasValidCart,
} from "../models/cartModel.js";
import { getItemDetailsByIds } from "../models/itemModel.js";
import type { CartRegisterApi } from "../schemas/cartItem.js";
import { cartItemsTable } from "../db/cart_item.js";
import { and, eq, isNull } from "drizzle-orm";
import type { AuthContext } from "../types/context.js";

export async function cartRegister(c: AuthContext) {
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

export async function getCarts(c: AuthContext) {
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

export async function updateCarts(c: AuthContext) {
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
      await updateCartItems(tx, cart.id, validatedItems.items);

      // 新しいアイテムの追加処理を追加
      await addNewCartItems(tx, cart.id, validatedItems.items);

      // 0のカートアイテムの削除処理を追加
      await deleteMissingCartItems(tx, cart.id);
    });
    return c.json({ message: "Cart updated successfully" }, 200);
  } catch (error) {
    console.error("Error in putCarts:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function deleteCarts(c: AuthContext) {
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
    const cart = await getCurrentCart(userId);
    if (!cart) {
      return c.json({ message: "Cart not found for the user" }, 404);
    }

    await db.transaction(async (tx) => {
      // カートの削除
      await deleteCartModel(tx, cart.user_id);

      // カートアイテムの削除処理を追加
      await deleteCartItemModel(tx, cart.id);
    });
    return c.json({ message: "Cart deleted successfully" }, 200);
  } catch (error) {
    console.error("Error in deleteCarts:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export const validateItems = async (c: AuthContext) => {
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
  cartId: number,
  items: CartRegisterApi[]
) => {
  try {
    const existingItemIds = new Set(
      await fetchExistingCartItemIds(
        tx,
        cartId,
        items.map((i) => i.itemId)
      )
    );

    const currentItems = items.filter((item) =>
      existingItemIds.has(item.itemId)
    );

    await Promise.all(
      currentItems.map((item) =>
        tx
          .update(cartItemsTable)
          .set({ quantity: item.quantity })
          .where(
            and(
              eq(cartItemsTable.cart_id, cartId),
              eq(cartItemsTable.item_id, item.itemId),
              isNull(cartItemsTable.deleted_at)
            )
          )
      )
    );
  } catch (error) {
    console.error("Error updating cart items:", error);
    throw new Error("Failed to update cart items");
  }
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
