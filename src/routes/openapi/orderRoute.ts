import { createRoute, z } from "@hono/zod-openapi";

export const openApiOrderTag = {
  name: "orders",
  description: "注文に関連するAPI",
};

export const createOrderRoute = createRoute({
  method: "post",
  path: "/",
  request: {},
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Order created successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "No cart found for the user",
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
  tags: [openApiOrderTag.name],
  summary: "注文を作成する",
  description: "注文を作成します",
});
