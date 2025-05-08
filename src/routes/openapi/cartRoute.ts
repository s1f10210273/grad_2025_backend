import { createRoute, z } from "@hono/zod-openapi";
import { cartRegisterApiSchema } from "../../schemas/cart.js";
import { cartGetApiSchema } from "../../schemas/cartItem.js";

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

export const cartGetRoute = createRoute({
  method: "get",
  path: "/",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: cartGetApiSchema,
        },
      },
      description: "Cart created successfully",
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
  summary: "カートの取得",
  description: "カートの取得を行います",
});
