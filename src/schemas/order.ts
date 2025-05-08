import { z } from "@hono/zod-openapi";
import { ordersInsertSchema } from "../db/order.js";
import { baseSchema as cartSchema } from "./cartItem.js";

const baseApiSchema = ordersInsertSchema.pick({
  id: true,
  crew_id: true,
  status_code: true,
  cart_id: true,
  delivered_at: true,
  created_at: true,
});

export const getOrderHistorySchema = z
  .object({
    orderId: baseApiSchema.shape.id.openapi({ example: 1 }),
    orderedAt: baseApiSchema.shape.created_at.openapi({
      example: "2023-10-01T00:00:00Z",
    }),
    deliveredAt: baseApiSchema.shape.delivered_at.openapi({
      example: "2023-10-01T00:00:00Z",
    }),
    crewId: baseApiSchema.shape.crew_id.openapi({
      example: "crew id",
    }),
    crewName: z
      .string()
      .openapi({
        example: "crew name",
      })
      .optional(),
    status: baseApiSchema.shape.status_code.openapi({
      example: 1,
    }),
    stores: z.array(
      z.object({
        //todo: dbの型を使いたい
        storeId: z.string().max(64).openapi({ example: "store id" }),
        storeName: z.string().max(64).openapi({ example: "store name" }),
        items: z.array(
          z.object({
            itemId: cartSchema.shape.item_id.openapi({ example: 1 }),
            itemName: cartSchema.shape.item_name.openapi({
              example: "item name",
            }),
            itemPrice: cartSchema.shape.item_price.openapi({ example: 100 }),
            storeId: cartSchema.shape.store_id.openapi({
              example: "store id",
            }),
            quantity: cartSchema.shape.quantity.openapi({ example: 1 }),
          })
        ),
      })
    ),
  })
  .openapi("get_order_history");

export const getOrderHistoryApiSchema = z
  .object({
    orders: z.array(getOrderHistorySchema),
  })
  .openapi("get_order_history_api");

export type GetOrderHistoryApiSchema = z.infer<typeof getOrderHistoryApiSchema>;
export type GetOrderHistoryApi = z.infer<typeof getOrderHistoryApiSchema>;
