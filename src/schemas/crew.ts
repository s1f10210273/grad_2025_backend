import { z } from "@hono/zod-openapi";
import { crewsInsertSchema } from "../db/crew.js";

export const crewRegisterApiSchema = z
  .object({
    name: crewsInsertSchema.shape.name.openapi({ example: "John Doe" }),
    email: crewsInsertSchema.shape.email.openapi({
      example: "john@example.com",
    }),
    password: crewsInsertSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("crew_register");

export const crewLoginApiSchema = z
  .object({
    email: crewsInsertSchema.shape.email.openapi({
      example: "john@example.com",
    }),
    password: crewsInsertSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  // これは、研修のスキーマ名に合わせたものです。
  .openapi("crew_login");
