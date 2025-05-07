import { createRoute, z } from "@hono/zod-openapi";
import { fetchItemApiSchema, storeAddItemApiSchema } from "../../schemas/item.js";

export const openApiItemTag = {
  name: "items",
  description: "商品に関するAPI",
} as const;

export const storeAddItemRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: storeAddItemApiSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Item added successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Invalid input",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Unauthorized",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Internal server error",
    },
  },
  tags: [openApiItemTag.name],
  summary: "itemの新規登録",
  description: "itemの新規登録を行います",
});

export const getAllItemsRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "商品一覧の取得に成功",
      content: {
        "application/json": {
          schema: fetchItemApiSchema,
        },
      },
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Internal Server Error",
    },
  },
  tags: [openApiItemTag.name],
  summary: "全商品を取得する",
  description: "全商品を取得する",
});