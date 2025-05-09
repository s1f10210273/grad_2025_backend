import { z } from "@hono/zod-openapi";
import { cartItemsInsertSchema } from "../db/cart_item.js";

export const cartRegisterApiSchema = z
  .object({
    items: z.array(
      z.object({
        itemId: cartItemsInsertSchema.shape.item_id.openapi({ example: 1 }),
        quantity: cartItemsInsertSchema.shape.quantity.openapi({ example: 1 }),
      })
    ),
  })
  .openapi("add_user_cart");

export type CartRegisterApi = z.infer<typeof cartRegisterApiSchema>;
