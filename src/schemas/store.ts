import { z } from "@hono/zod-openapi";
import { storeInsertSchema } from "../db/store.js";

const baseApiSchema = storeInsertSchema.pick({
  name: true,
  email: true,
  password: true,
});

export const storeRegisterApiSchema = z
  .object({
    name: baseApiSchema.shape.name.openapi({ example: "John Doe" }),
    email: baseApiSchema.shape.email.openapi({ example: "john@example.com" }),
    password: baseApiSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("store_register");

export const storeLoginApiSchema = z
  .object({
    email: baseApiSchema.shape.email.openapi({ example: "john@example.com" }),
    password: baseApiSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("store_login");
