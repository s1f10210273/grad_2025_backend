import { z } from "@hono/zod-openapi";
import { itemsInsertSchema } from "../db/item.js";

export const storeAddItemApiSchema = z
  .object({
    name: itemsInsertSchema.shape.name.openapi({ example: "Item Name" }),
    price: itemsInsertSchema.shape.price.openapi({ example: 1000 }),
    // データベースの型と実際のAPIの型は異なるため
    file: z.any().openapi({
      format: "binary",
      description: "Image file to upload",
    }),
  })
  .openapi("store_add_item");

export const fetchItemSchema = z.object({
  itemId: itemsInsertSchema.shape.id.openapi({ example: 1 }),
  itemName: itemsInsertSchema.shape.name.openapi({ example: "Item Name" }),
  price: itemsInsertSchema.shape.price.openapi({ example: 1000 }),
  imgUrl: itemsInsertSchema.shape.img_url.openapi({
    example: "https://example.com/image.jpg",
  }),
});

export const fetchItemApiSchema = z
  .object({
    stores: z.array(
      z.object({
        storeId: z.string(),
        storeName: z.string(),
        items: z.array(fetchItemSchema),
      })
    ),
  })
  .openapi("get_item");

export type FetchItemApi = z.infer<typeof fetchItemApiSchema>;
