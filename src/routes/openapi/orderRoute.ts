import { createRoute, z } from "@hono/zod-openapi";
import {
  getOrderAvailableApiSchema,
  getOrderHistoryApiSchema,
} from "../../schemas/order.js";

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

export const getOrderHistoryRoute = createRoute({
  method: "get",
  path: "/",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getOrderHistoryApiSchema,
        },
      },
      description: "Order history retrieved successfully",
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
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "No order history found",
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
  summary: "注文履歴を表示",
  description: "注文履歴を表示します",
});

export const postOrderCompleteRoute = createRoute({
  method: "post",
  path: "/{orderId}/complete",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Order completed successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "invalid order ID",
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
  summary: "注文を完了する",
  description: "注文を完了します",
});

export const getOrderAvailableRoute = createRoute({
  method: "get",
  path: "/available",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getOrderAvailableApiSchema,
        },
      },
      description: "Successful operation",
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
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "No available orders found",
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
  summary: "注文可能な商品を取得",
  description: "注文可能な商品を取得します",
});
