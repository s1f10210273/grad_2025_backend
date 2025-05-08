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
    items: z.array(
      z.object({
    itemId: baseSchema.shape.item_id.openapi({example: 1}),
    quantity: baseSchema.shape.quantity.openapi({example: 1}),
      })
    )}).openapi("add_user_cart");

export type CartRegisterApi = z.infer<typeof cartRegisterApiSchema>;
