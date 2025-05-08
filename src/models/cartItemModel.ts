import { db } from "../db.js";
import { cartItemsTable } from "../db/cart_item.js";
import type { CartRegisterApi } from "../schemas/cartItem.js";
import type { CartRegisterApi as ca } from "../schemas/cart.js";
import { and, eq, inArray, isNull } from "drizzle-orm";

export const createcartItems = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  cartId: number,
  items: CartRegisterApi[]
) => {
  const cartItemsData = items.map((item) => ({
    cart_id: cartId,
    item_id: item.itemId,
    item_name: item.itemName,
    item_price: item.itemPrice,
    store_id: item.storeId,
    quantity: item.quantity,
  }));

  const result = await tx.insert(cartItemsTable).values(cartItemsData);
  return result;
};

export const deleteMissingCartItems = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  cartId: number,
  items: { itemId: number; quantity: number }[]
) => {
  const itemIds = items.map((item) => item.itemId);
  const result = await tx
    .update(cartItemsTable)
    .set({
      deleted_at: new Date(),
    })
    .where(
      and(
        eq(cartItemsTable.cart_id, cartId),
        isNull(cartItemsTable.deleted_at),
        inArray(cartItemsTable.item_id, itemIds)
      )
    );
};

export const fetchExistingCartItemIds = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  cartId: number,
  itemIds: number[]
) => {
  const existingItems = await tx
    .select({
      itemId: cartItemsTable.item_id,
    })
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.cart_id, cartId),
        isNull(cartItemsTable.deleted_at),
        inArray(cartItemsTable.item_id, itemIds)
      )
    );

  return existingItems.map((item) => item.itemId);
};

export const insertNewCartItems = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  cartId: number,
  items: CartRegisterApi[]
) => {
  const cartItemsData = items.map((item) => ({
    cart_id: cartId,
    item_id: item.itemId,
    item_name: item.itemName,
    item_price: item.itemPrice,
    store_id: item.storeId,
    quantity: item.quantity,
  }));

  await tx.insert(cartItemsTable).values(cartItemsData);
};

export const deleteCartItemModel = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  cartId: number
) => {
  await tx
    .update(cartItemsTable)
    .set({
      deleted_at: new Date(),
    })
    .where(
      and(eq(cartItemsTable.cart_id, cartId), isNull(cartItemsTable.deleted_at))
    );
};
