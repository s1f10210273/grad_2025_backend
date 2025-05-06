import type { MiddlewareHandler } from "hono";
import { userRegisterApiSchema } from "../schemas/user.js";
import { existsUserByEmail, existsUserByName } from "../models/userModel.js";

export const validateUserRegister: MiddlewareHandler = async (c, next) => {
	try {
		const body = await c.req.json();

		const validationResult = userRegisterApiSchema.safeParse(body);
		if (!validationResult.success) {
			return c.json(
				{
					message: "Invalid input",
					details: validationResult.error.errors,
				},
				400,
			);
		}

		// nameの重複チェック
		const isNameUsed = await existsUserByName(body.name);
		if (isNameUsed) {
			return c.json(
				{
					message: "This name is already used",
				},
				422,
			);
		}

		// emailの重複チェック
		const isEmailUsed = await existsUserByEmail(body.email);
		if (isEmailUsed) {
			return c.json(
				{
					message: "This email is already used",
				},
				422,
			);
		}

		await next();
	} catch (error) {
		return c.json(
			{
				message: "Internal server error",
			},
			500,
		);
	}
};
