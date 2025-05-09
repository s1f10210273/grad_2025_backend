import { z } from "@hono/zod-openapi";
import { userInsertSchema } from "../db/user.js";

export const userRegisterApiSchema = z
  .object({
    name: userInsertSchema.shape.name.openapi({ example: "John Doe" }),
    email: userInsertSchema.shape.email.openapi({
      example: "john@example.com",
    }),
    address: userInsertSchema.shape.address.openapi({ example: "123 Main St" }),
    password: userInsertSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("user_register");

export const userLoginApiSchema = z
  .object({
    email: userInsertSchema.shape.email.openapi({
      example: "john@example.com",
    }),
    password: userInsertSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("user_login");
