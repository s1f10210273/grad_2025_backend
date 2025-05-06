import { createRoute, z } from "@hono/zod-openapi";
import {
  storeLoginApiSchema,
  storeRegisterApiSchema
} from "../../schemas/store.js";

export const openApiStoreTag = {
  name: "stores",
  description: "店舗管理に関連するAPI",
};

export const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: storeRegisterApiSchema,
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
            // todo:いらないかも！！！
            userId: z.string(),
          }),
        },
      },
      description: "store registered successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            details: z.array(z.any()).optional(),
          }),
        },
      },
      description: "Invalid input",
    },
    422: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "This email is already used",
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
  tags: [openApiStoreTag.name],
  summary: "storeの新規登録",
  description: "ユーザー情報を受け取り、新規アカウントを作成します",
});

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: storeLoginApiSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            // todo:いらないかも！！！
            userId: z.string(),
          }),
        },
      },
      description: "Login successful",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Invalid email or password",
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
  tags: [openApiStoreTag.name],
  summary: "storeのログイン",
  description: "メールアドレスとパスワードでログインを行います",
});

export const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
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
      description: "Logout successful",
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
  tags: [openApiStoreTag.name],
  summary: "storeのログアウト",
  description: "ログアウトを行います",
});
