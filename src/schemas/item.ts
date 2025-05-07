import { z } from "@hono/zod-openapi";
import { itemsInsertSchema } from "../db/item.js";

const baseApiSchema = itemsInsertSchema.pick({
  id: true,
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


  export const fetchItemSchema = z.object({
    itemId: baseApiSchema.shape.id.openapi({ example: 1 }),
    itemName: baseApiSchema.shape.name.openapi({ example: "Item Name" }),
    price: baseApiSchema.shape.price.openapi({ example: 1000 }),
    imgUrl: baseApiSchema.shape.img_url.openapi({
      example: "https://example.com/image.jpg",
    }),
  });

  export const fetchItemApiSchema = z.object({
    stores: z.array(
      z.object({
        storeId: z.string(),
        storeName: z.string(),
        items: z.array(fetchItemSchema),
      })
    ),
  }).openapi("get_item");



export type FetchItemApi = z.infer<typeof fetchItemApiSchema>;