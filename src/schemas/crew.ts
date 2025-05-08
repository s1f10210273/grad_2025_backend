import { z } from "@hono/zod-openapi";
import { crewsInsertSchema } from "../db/crew.js";

const baseApiSchema = crewsInsertSchema.pick({
  name: true,
  email: true,
  password: true,
});

export const crewRegisterApiSchema = z
  .object({
    name: baseApiSchema.shape.name.openapi({ example: "John Doe" }),
    email: baseApiSchema.shape.email.openapi({ example: "john@example.com" }),
    password: baseApiSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("crew_register");

export const crewLoginApiSchema = z
  .object({
    email: baseApiSchema.shape.email.openapi({ example: "john@example.com" }),
    password: baseApiSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("crew_login");
