import { existsStoreByEmail, existsStoreByName } from "../models/storeModel.js";
import { storeRegisterApiSchema } from "../schemas/store.js";
import type { AuthContext } from "../types/context.js";

export const validateStoreRegister = async (c: AuthContext) => {
  try {
    const body = await c.req.json();

    const validationResult = storeRegisterApiSchema.safeParse(body);
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
    const isNameUsed = await existsStoreByName(body.name);
    if (isNameUsed) {
      return c.json(
        {
          message: "This name is already used",
        },
        422
      );
    }

    // emailの重複チェック
    const isEmailUsed = await existsStoreByEmail(body.email);
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
