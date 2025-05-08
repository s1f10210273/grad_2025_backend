import { createRoute, z } from "@hono/zod-openapi";
import { cartRegisterApiSchema } from "../../schemas/cart.js";


export const openApiCartTag = {
  name: "carts",
  description: "カートに関するAPI",
} as const;

export const cartAddRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: cartRegisterApiSchema,
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
      description: "Cart created successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "User already has a cart",
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
  tags: [openApiCartTag.name],
  summary: "カートの新規登録",
  description: "カートの新規登録を行います",
});
