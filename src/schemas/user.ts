import { z } from "@hono/zod-openapi";
import { userInsertSchema } from "../db/user.js";

const baseApiSchema = userInsertSchema.pick({
	name: true,
	email: true,
	address: true,
	password: true,
});

export const userRegisterApiSchema = z
	.object({
		name: baseApiSchema.shape.name.openapi({ example: "John Doe" }),
		email: baseApiSchema.shape.email.openapi({ example: "john@example.com" }),
		address: baseApiSchema.shape.address.openapi({ example: "123 Main St" }),
		password: baseApiSchema.shape.password.openapi({
			example: "securePassword123",
		}),
	})
	// これは、研修のスキーマ名に合わせたものです。
	.openapi("user_register");

export const userLoginApiSchema = z
	.object({
		email: baseApiSchema.shape.email.openapi({ example: "john@example.com" }),
		password: baseApiSchema.shape.password.openapi({
			example: "securePassword123",
		}),
	})
	// これは、研修のスキーマ名に合わせたものです。
	.openapi("user_login");
