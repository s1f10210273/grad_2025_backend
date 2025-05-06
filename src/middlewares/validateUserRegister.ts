import type { MiddlewareHandler } from "hono";
import { userApiSchema } from "../schemas/user.js";

export const validateUserRegister: MiddlewareHandler = async (c, next) => {
  try {
    const body = await c.req.json();

    const validationResult = userApiSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json(
        {
          message: "Invalid input",
          details: validationResult.error.errors,
        },
        400
      );
    }

    // todo: emailの確認
    const isEmailUsed = false;
    if (isEmailUsed) {
      return c.json(
        {
          message: "This email is already used",
        },
        422
      );
    }

    // todo: nameの確認
    const isNameUsed = false;
    if (isNameUsed) {
      return c.json(
        {
          message: "This name is already used",
        },
        422
      );
    }

    await next();
  } catch (error) {
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};
