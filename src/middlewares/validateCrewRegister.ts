import type { MiddlewareHandler } from "hono";

import { crewRegisterApiSchema } from "../schemas/crew.js";
import { existsCrewByEmail, existsCrewByName } from "../models/crewModel.js";

export const validateCrewRegister: MiddlewareHandler = async (c, next) => {
  try {
    const body = await c.req.json();

    const validationResult = crewRegisterApiSchema.safeParse(body);
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
    const isNameUsed = await existsCrewByName(body.name);
    if (isNameUsed) {
      return c.json(
        {
          message: "This name is already used",
        },
        422
      );
    }

    // emailの重複チェック
    const isEmailUsed = await existsCrewByEmail(body.email);
    if (isEmailUsed) {
      return c.json(
        {
          message: "This email is already used",
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
