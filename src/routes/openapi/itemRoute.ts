import { createRoute, z } from "@hono/zod-openapi";
import {
  storeAddItemApiSchema
} from "../../schemas/item.js";

export const openApiItemTag = {
  name: "items",
  description: "itemに関連するAPI",
};

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