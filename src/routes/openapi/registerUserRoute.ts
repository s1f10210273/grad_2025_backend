import { createRoute, z } from "@hono/zod-openapi";
import { userApiSchema } from "../../schemas/user.js";

export const registerUserRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: userApiSchema,
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
      description: "user registered successfully",
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
  tags: ["user"],
  summary: "userの新規登録",
  description: "ユーザー情報を受け取り、新規アカウントを作成します",
});
