import { createRoute, z } from "@hono/zod-openapi";

export const openApiAuthTag = {
  name: "auth",
  description: "権限に関するAPI",
} as const;

export const checkAuthRoute = createRoute({
  method: "get",
  path: "/checkAuth",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.enum(["user", "crew", "store"]),
        },
      },
      description: "Authorized",
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
  tags: [openApiAuthTag.name],
  summary: "認証確認",
  description: "認証確認を行います",
});

export const deleteAuthRoute = createRoute({
  method: "get",
  path: "/deleteAuth",
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
      description: "conpleted",
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
  tags: [openApiAuthTag.name],
  summary: "認証の破棄",
  description: "認証の破棄を行います",
});
