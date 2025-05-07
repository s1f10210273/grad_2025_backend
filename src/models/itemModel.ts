import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { type ItemsInsert, itemsTable } from "../db/item.js";
import { storeTable } from "../db/store.js";

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

export const getAllItems = async () => {
  const items = await db
    .select({
      storeId: storeTable.uuid,
      storeName: storeTable.name,
      itemId: itemsTable.id,
      itemName: itemsTable.name,
      price: itemsTable.price,
      imgUrl: itemsTable.img_url,
    })
    .from(itemsTable)
    .innerJoin(storeTable, eq(itemsTable.store_id, storeTable.uuid))
    .where(
      and(
        isNull(itemsTable.deleted_at),
        isNull(storeTable.deleted_at)
      )
    );

    const storesMap: { [key: string]: any } = {};

    items.forEach((item) => {
      const storeId = item.storeId;
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
      });
    });

    const stores = Object.values(storesMap);

    return { stores };
}