import { db } from "../db.js";
import { type ItemsInsert, itemsTable } from "../db/item.js";
import { storeTable } from "../db/store.js";
import { ordersTable } from "../db/order.js";
import { and, eq, isNull } from "drizzle-orm";
import { crewsTable } from "../db/crew.js";
import { cartItemsTable } from "../db/cart_item.js";
import type {
  GetOrderAvailable,
  GetOrderAvailableApiSchema,
} from "../schemas/order.js";
import { use } from "hono/jsx";
import { usersTable } from "../db/user.js";

const orderStatus = {
  notReceivedAnOrder: 1,
  receivedAnOrderAndDelivered: 2,
} as const;

export const createOrder = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string,
  cartId: number
) => {
  await tx.insert(ordersTable).values({
    user_id: userId,
    cart_id: cartId,
    status_code: orderStatus.notReceivedAnOrder,
  });
};

export const getOrders = async (userId: string) => {
  const orders = await db
    .select({
      orderId: ordersTable.id,
      orderedAt: ordersTable.created_at,
      deliveredAt: ordersTable.delivered_at,
      crewId: ordersTable.crew_id,
      crewName: crewsTable.name,
      status: ordersTable.status_code,
      storeId: storeTable.uuid,
      storeName: storeTable.name,
      itemId: itemsTable.id,
      itemName: itemsTable.name,
      itemPrice: itemsTable.price,
      imgUrl: itemsTable.img_url,
      quantity: cartItemsTable.quantity,
    })
    .from(ordersTable)
    .innerJoin(cartItemsTable, eq(ordersTable.cart_id, cartItemsTable.cart_id))
    .innerJoin(itemsTable, eq(cartItemsTable.item_id, itemsTable.id))
    .innerJoin(storeTable, eq(itemsTable.store_id, storeTable.uuid))
    .leftJoin(crewsTable, eq(ordersTable.crew_id, crewsTable.uuid))
    .where(and(eq(ordersTable.user_id, userId)));

  const orderMap = new Map<number, any>();

  for (const row of orders) {
    // 1. orderId ごとにグループ
    if (!orderMap.has(row.orderId)) {
      orderMap.set(row.orderId, {
        orderId: row.orderId,
        orderedAt: row.orderedAt,
        deliveredAt: row.deliveredAt,
        crewId: row.crewId,
        crewName: row.crewName,
        status: row.status,
        stores: [],
      });
    }

    const order = orderMap.get(row.orderId);

    // 2. storeId ごとにネスト
    let store = order.stores.find((s: any) => s.storeId === row.storeId);
    if (!store) {
      store = {
        storeId: row.storeId,
        storeName: row.storeName,
        items: [],
      };
      order.stores.push(store);
    }

    // 3. item を追加
    store.items.push({
      itemId: row.itemId,
      itemName: row.itemName,
      price: row.itemPrice,
      quantity: row.quantity,
    });
  }

  return { orders: Array.from(orderMap.values()) };
};

export const createCompleteOrderStatus = async (
  crewId: string,
  orderId: number
) => {
  await db
    .update(ordersTable)
    .set({
      status_code: orderStatus.receivedAnOrderAndDelivered,
      crew_id: crewId,
      delivered_at: new Date(),
    })
    .where(and(eq(ordersTable.id, orderId), isNull(ordersTable.deleted_at)));
};

export const getAvailableOrders = async () => {
  const orders = await db
    .select({
      orderId: ordersTable.id,
      orderedAt: ordersTable.created_at,
      status: ordersTable.status_code,
      userId: ordersTable.user_id,
      userAddress: usersTable.address,
      storeId: storeTable.uuid,
      storeName: storeTable.name,
      itemId: itemsTable.id,
      itemName: itemsTable.name,
      itemPrice: itemsTable.price,
      quantity: cartItemsTable.quantity,
    })
    .from(ordersTable)
    .innerJoin(cartItemsTable, eq(ordersTable.cart_id, cartItemsTable.cart_id))
    .innerJoin(itemsTable, eq(cartItemsTable.item_id, itemsTable.id))
    .innerJoin(storeTable, eq(itemsTable.store_id, storeTable.uuid))
    .innerJoin(usersTable, eq(ordersTable.user_id, usersTable.uuid))
    .where(
      and(
        eq(ordersTable.status_code, orderStatus.notReceivedAnOrder),
        isNull(ordersTable.deleted_at)
      )
    );
  const ordersMap = new Map<string, GetOrderAvailable>();

  for (const row of orders) {
    const mapKey = `${row.orderId}-${row.storeId}`;

    if (!ordersMap.has(mapKey)) {
      ordersMap.set(mapKey, {
        orderId: row.orderId,
        orderedAt: row.orderedAt,
        status: row.status,
        userId: row.userId,
        userAddress: row.userAddress,
        storeId: row.storeId,
        storeName: row.storeName,
        items: [],
      });
    }

    // Mapから現在のキーに対応する注文＋ストアオブジェクトを取得
    const currentOrderStore = ordersMap.get(mapKey)!;

    if (row.itemId != null) {
      currentOrderStore.items.push({
        itemId: row.itemId,
        itemName: row.itemName,
        price: row.itemPrice,
        quantity: row.quantity,
      });
    }
  }

  const formattedOrders: GetOrderAvailable[] = Array.from(ordersMap.values());
  return { orders: formattedOrders };
};
