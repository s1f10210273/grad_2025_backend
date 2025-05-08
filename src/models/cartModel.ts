import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { cartsTable } from "../db/cart.js";
import { cartItemsTable } from "../db/cart_item.js";
import { storeTable } from "../db/store.js";
import { itemsTable } from "../db/item.js";
import type { CartGetApi } from "../schemas/cartItem.js";

// カートが存在するか確認
export const hasValidCart = async (userId: string) => {
  const [cart] = await db
    .select()
    .from(cartsTable)
    .where(
      and(
        eq(cartsTable.user_id, userId),
        isNull(cartsTable.ordered_at),
        isNull(cartsTable.deleted_at)
      )
    )
    .limit(1);
  return cart !== undefined;
};

// カートの作成
export const createCart = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string
) => {
  const cartData = {
    user_id: userId,
  };

  const result = await tx.insert(cartsTable).values(cartData);
  return result[0].insertId;
};

// 現在のアクティブなカートを取得
export const getCurrentCart = async (userId: string) => {
  const [cart] = await db
    .select()
    .from(cartsTable)
    .where(
      and(
        eq(cartsTable.user_id, userId),
        isNull(cartsTable.ordered_at),
        isNull(cartsTable.deleted_at)
      )
    )
    .limit(1);

  return cart;
};

export const getCurrentCartId = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string
) => {
  const [cart] = await tx
    .select({
      cartId: cartsTable.id,
    })
    .from(cartsTable)
    .where(
      and(
        eq(cartsTable.user_id, userId),
        isNull(cartsTable.ordered_at),
        isNull(cartsTable.deleted_at)
      )
    )
    .limit(1);
  return cart?.cartId;
};

// カートの取得
export const getCartDetailByUserId = async (
  userId: string
): Promise<CartGetApi> => {
  const cart = await db
    .select({
      storeId: cartItemsTable.store_id,
      storeName: storeTable.name,
      itemId: cartItemsTable.item_id,
      itemName: cartItemsTable.item_name,
      price: cartItemsTable.item_price,
      imgUrl: itemsTable.img_url,
      quantity: cartItemsTable.quantity,
    })
    .from(cartsTable)
    .leftJoin(cartItemsTable, eq(cartsTable.id, cartItemsTable.cart_id))
    .leftJoin(storeTable, eq(cartItemsTable.store_id, storeTable.uuid))
    .leftJoin(itemsTable, eq(cartItemsTable.item_id, itemsTable.id))
    .where(
      and(
        eq(cartsTable.user_id, userId),
        isNull(cartsTable.ordered_at),
        isNull(cartsTable.deleted_at)
      )
    );
  const storesMap: { [key: string]: any } = {};

  cart.forEach((item) => {
    const storeId = String(item.storeId);
    if (!storesMap[storeId]) {
      storesMap[storeId] = {
        storeId: item.storeId,
        storeName: item.storeName,
        items: [],
      };
    }

    storesMap[storeId].items.push({
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      imgUrl: item.imgUrl,
      quantity: item.quantity,
    });
  });

  const stores = Object.values(storesMap);

  return { stores };
};

export const deleteCartModel = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  user_id: string
) => {
  await tx
    .update(cartsTable)
    .set({
      deleted_at: new Date(),
    })
    .where(
      and(
        eq(cartsTable.user_id, user_id),
        isNull(cartsTable.ordered_at),
        isNull(cartsTable.deleted_at)
      )
    );
};
