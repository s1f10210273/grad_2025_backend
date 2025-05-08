import { db } from "../db.js";
import { type ItemsInsert, itemsTable } from "../db/item.js";
import { storeTable } from "../db/store.js";
import { ordersTable } from "../db/order.js";

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
