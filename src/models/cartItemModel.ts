import { db } from "../db.js";
import { cartItemsTable } from "../db/cart_item.js";
import type { CartRegisterApi } from "../schemas/cartItem.js";


export const createcartItems = async (tx:Parameters<Parameters<typeof db.transaction>[0]>[0],cartId: number,items: CartRegisterApi[]) => {
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
}