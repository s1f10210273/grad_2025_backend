import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { type ItemsInsert, itemsTable } from "../db/item.js";

export const addItem = async (item: ItemsInsert) => {
  await db.insert(itemsTable).values(item);
};

export const findItemsByStoreId = async (storeId: string) => {
  const items = await db
    .select()
    .from(itemsTable)
    .where(and(eq(itemsTable.store_id, storeId), isNull(itemsTable.deleted_at)));
  return items;
};