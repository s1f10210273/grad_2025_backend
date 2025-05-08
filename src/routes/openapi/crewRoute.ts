import { createRoute, z } from "@hono/zod-openapi";
import {
  crewLoginApiSchema,
  crewRegisterApiSchema,
} from "../../schemas/crew.js";

export const openApiCrewTag = {
  name: "crews",
  description: "クルー管理に関連するAPI",
};

export const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: crewRegisterApiSchema,
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
      description: "crew registered successfully",
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
  tags: [openApiCrewTag.name],
  summary: "crewの新規登録",
  description: "ユーザー情報を受け取り、新規アカウントを作成します",
});

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: crewLoginApiSchema,
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
  tags: [openApiCrewTag.name],
  summary: "crewのログイン",
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
  tags: [openApiCrewTag.name],
  summary: "crewのログアウト",
  description: "ログアウトを行います",
});
