import { z } from "@hono/zod-openapi";
import { userInsertSchema } from "../db/user.js";

const baseApiSchema = userInsertSchema.pick({
  name: true,
  email: true,
  address: true,
  password: true,
});

export const userApiSchema = z
  .object({
    name: baseApiSchema.shape.name.openapi({ example: "John Doe" }),
    email: baseApiSchema.shape.email.openapi({ example: "john@example.com" }),
    address: baseApiSchema.shape.address.openapi({ example: "123 Main St" }),
    password: baseApiSchema.shape.password.openapi({
      example: "securePassword123",
    }),
  })
  .openapi("UserApiSchema");
