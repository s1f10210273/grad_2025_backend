import { z } from "@hono/zod-openapi";
import { storeInsertSchema } from "../db/store.js";

export const storeRegisterApiSchema = z
  .object({
    name: storeInsertSchema.shape.name.openapi({ example: "John Doe" }),
    email: storeInsertSchema.shape.email.openapi({
      example: "john@example.com",
    }),
    password: storeInsertSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("store_register");

export const storeLoginApiSchema = z
  .object({
    email: storeInsertSchema.shape.email.openapi({
      example: "john@example.com",
    }),
    password: storeInsertSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("store_login");
