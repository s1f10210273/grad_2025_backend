import { z } from "@hono/zod-openapi";
import { cartItemsInsertSchema } from "../db/cart_item.js";

const baseSchema = cartItemsInsertSchema.pick({
  item_id: true,
  item_name: true,
  item_price: true,
  store_id: true,
  quantity: true,
});

export const cartRegisterApiSchema = z
  .object({
    itemId: baseSchema.shape.item_id.openapi({ example: 1 }),
    itemName: baseSchema.shape.item_name.openapi({ example: "item name" }),
    itemPrice: baseSchema.shape.item_price.openapi({ example: 100 }),
    storeId: baseSchema.shape.store_id.openapi({ example: "store id" }),
    quantity: baseSchema.shape.quantity.openapi({ example: 1 }),
  })
  .openapi("add_user_cart");

export type CartRegisterApi = z.infer<typeof cartRegisterApiSchema>;

export const cartGetApiSchema = z
  .object({
    stores: z.array(
      z.object({
        //todo: dbの型を使いたい
        storeId: z.string().max(64).openapi({ example: "store id" }),
        storeName: z.string().max(64).openapi({ example: "store name" }),
        items: z.array(
          z.object({
            itemId: baseSchema.shape.item_id.openapi({ example: 1 }),
            itemName: baseSchema.shape.item_name.openapi({
              example: "item name",
            }),
            itemPrice: baseSchema.shape.item_price.openapi({ example: 100 }),
            storeId: baseSchema.shape.store_id.openapi({ example: "store id" }),
            quantity: baseSchema.shape.quantity.openapi({ example: 1 }),
          })
        ),
      })
    ),
  })
  .openapi("get_user_cart");

export type CartGetApi = z.infer<typeof cartGetApiSchema>;
