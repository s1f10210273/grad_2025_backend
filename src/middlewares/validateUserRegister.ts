import type { MiddlewareHandler } from "hono";
import { existsUserByEmail, existsUserByName } from "../models/userModel.js";
import { userRegisterApiSchema } from "../schemas/user.js";
import type { AuthContext } from "../types/context.js";

export const validateUserRegister = async (c: AuthContext) => {
  try {
    const body = await c.req.json();

    const validationResult = userRegisterApiSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json(
        {
          message: "Invalid input",
          details: validationResult.error.errors,
        },
        400
      );
    }

    // nameの重複チェック
    const isNameUsed = await existsUserByName(body.name);
    if (isNameUsed) {
      return c.json(
        {
          message: "This name is already used",
        },
        422
      );
    }

    // emailの重複チェック
    const isEmailUsed = await existsUserByEmail(body.email);
    if (isEmailUsed) {
      return c.json(
        {
          message: "This email is already used",
        },
        422
      );
    }

    return null;
  } catch (error) {
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};
