import { z } from "@hono/zod-openapi";
import { ordersInsertSchema } from "../db/order.js";
import { cartItemsInsertSchema } from "../db/cart_item.js";
import { crewsInsertSchema } from "../db/crew.js";
import { storeInsertSchema } from "../db/store.js";
import { userInsertSchema } from "../db/user.js";

export const getOrderHistorySchema = z
  .object({
    orderId: ordersInsertSchema.shape.id.openapi({ example: 1 }),
    orderedAt: ordersInsertSchema.shape.created_at.openapi({
      example: "2023-10-01T00:00:00Z",
    }),
    deliveredAt: ordersInsertSchema.shape.delivered_at.openapi({
      example: "2023-10-01T00:00:00Z",
    }),
    crewId: ordersInsertSchema.shape.crew_id.openapi({
      example: "crew id",
    }),
    crewName: crewsInsertSchema.shape.name
      .openapi({
        example: "crew name",
      })
      .optional(),
    status: ordersInsertSchema.shape.status_code.openapi({
      example: 1,
    }),
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
            price: cartItemsInsertSchema.shape.item_price.openapi({
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
  .openapi("get_order_history");

export const getOrderHistoryApiSchema = z
  .object({
    orders: z.array(getOrderHistorySchema),
  })
  .openapi("get_order_history_api");

export const getOrderAvailableSchema = z
  .object({
    orderId: ordersInsertSchema.shape.id.openapi({ example: 1 }),
    orderedAt: ordersInsertSchema.shape.created_at.openapi({
      example: "2023-10-01T00:00:00Z",
    }),
    status: ordersInsertSchema.shape.status_code.openapi({
      example: 1,
    }),
    userId: ordersInsertSchema.shape.user_id.openapi({
      example: "user id",
    }),
    userAddress: userInsertSchema.shape.address.openapi({
      example: "user address",
    }),
    storeId: cartItemsInsertSchema.shape.store_id.openapi({
      example: "store id",
    }),
    storeName: storeInsertSchema.shape.name.openapi({
      example: "store name",
    }),
    items: z.array(
      z.object({
        itemId: cartItemsInsertSchema.shape.item_id.openapi({ example: 1 }),
        itemName: cartItemsInsertSchema.shape.item_name.openapi({
          example: "item name",
        }),
        price: cartItemsInsertSchema.shape.item_price.openapi({ example: 100 }),
        quantity: cartItemsInsertSchema.shape.quantity.openapi({ example: 1 }),
      })
    ),
  })
  .openapi("get_order_available");

export const getOrderAvailableApiSchema = z
  .object({
    orders: z.array(getOrderAvailableSchema),
  })
  .openapi("get_order_available_api");

export type GetOrderAvailableApiSchema = z.infer<
  typeof getOrderAvailableApiSchema
>;
export type GetOrderAvailable = z.infer<typeof getOrderAvailableSchema>;
export type GetOrderHistoryApiSchema = z.infer<typeof getOrderHistoryApiSchema>;
export type GetOrderHistoryApi = z.infer<typeof getOrderHistoryApiSchema>;
