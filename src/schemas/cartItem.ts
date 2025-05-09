import { z } from "@hono/zod-openapi";
import { cartItemsInsertSchema } from "../db/cart_item.js";
import { storeInsertSchema } from "../db/store.js";

export const cartRegisterApiSchema = z
  .object({
    itemId: cartItemsInsertSchema.shape.item_id.openapi({ example: 1 }),
    itemName: cartItemsInsertSchema.shape.item_name.openapi({
      example: "item name",
    }),
    itemPrice: cartItemsInsertSchema.shape.item_price.openapi({ example: 100 }),
    storeId: cartItemsInsertSchema.shape.store_id.openapi({
      example: "store id",
    }),
    quantity: cartItemsInsertSchema.shape.quantity.openapi({ example: 1 }),
  })
  .openapi("add_user_cart");

export type CartRegisterApi = z.infer<typeof cartRegisterApiSchema>;

export const cartGetApiSchema = z
  .object({
    stores: z.array(
      z.object({
        storeId: storeInsertSchema.shape.uuid.openapi({ example: "store id" }),
        storeName: storeInsertSchema.shape.name.openapi({
          example: "store name",
        }),
        items: z.array(
          z.object({
            itemId: cartItemsInsertSchema.shape.item_id.openapi({ example: 1 }),
            itemName: cartItemsInsertSchema.shape.item_name.openapi({
              example: "item name",
            }),
            itemPrice: cartItemsInsertSchema.shape.item_price.openapi({
              example: 100,
            }),
            storeId: cartItemsInsertSchema.shape.store_id.openapi({
              example: "store id",
            }),
            quantity: cartItemsInsertSchema.shape.quantity.openapi({
              example: 1,
            }),
          })
        ),
      })
    ),
  })
  .openapi("get_user_cart");

export type CartGetApi = z.infer<typeof cartGetApiSchema>;
