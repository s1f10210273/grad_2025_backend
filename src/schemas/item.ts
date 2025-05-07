import { z } from "@hono/zod-openapi";
import { itemsInsertSchema } from "../db/item.js";

const baseApiSchema = itemsInsertSchema.pick({
  name: true,
  price: true,
  store_id: true,
  img_url: true,
});

export const storeAddItemApiSchema = z
  .object({
    name: baseApiSchema.shape.name.openapi({ example: "Item Name" }),
    price: z.string().openapi({ example: "1000" }),
    file: z
      .any()
      .openapi({
        format: "binary",
        description: "Image file to upload",
      })
    }).openapi("store_add_item");
