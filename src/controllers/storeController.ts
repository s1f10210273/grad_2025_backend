import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import type { StoreInsert } from "../db/store.js";
import { sessionExpirationTime } from "../helpers/const.js";
import { storeCheckAuth } from "../middlewares/storeCheckAuth.js";
import { findStoreByEmail, registerStore } from "../models/storeModel.js";
import type { AuthContext } from "../types/context.js";
import { validateStoreRegister } from "../middlewares/validateStoreRegister.js";

export async function storeRegister(c: AuthContext) {
  const validateResponce = await validateStoreRegister(c);
  if (validateResponce) {
    return validateResponce;
  }
  const body = await c.req.json();
  const name: string = body.name;
  const email: string = body.email;
  const password: string = body.password;

  try {
    const storeId = uuidv4();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const store: StoreInsert = {
      uuid: storeId,
      name: name,
      email: email,
      password: hashedPassword,
    };

    await registerStore(store);

    const session = await c.get("session");
    await session.set("uuid", store.uuid);
    await session.set("role", "store");
    await session.set("expirationTime", Date.now() + sessionExpirationTime);

    return c.json(
      {
        message: "store registered successfully",
        userId: store.uuid,
      },
      201
    );
  } catch (e) {
    console.error(e);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
}

export async function storeLogin(c: AuthContext) {
  const session = await c.get("session");
  if (session.get("uuid")) {
    console.log("session", session.get("uuid"));
    return c.json(
      {
        message: "User is already logged in",
      },
      400
    );
  }

  try {
    const body = await c.req.json();
    const email: string = body.email;
    const password: string = body.password;

    const store = await findStoreByEmail(email);
    if (!store) {
      return c.json(
        {
          message: "Invalid email",
        },
        400
      );
    }

    const isPasswordValid = await bcrypt.compare(password, store.password);
    if (isPasswordValid) {
      await session.set("uuid", store.uuid);
      await session.set("role", "store");
      await session.set("expirationTime", Date.now() + sessionExpirationTime);
      return c.json(
        {
          message: "Login successful",
          userId: store.uuid,
        },
        200
      );
    }
    return c.json(
      {
        message: "Invalid email or password",
      },
      400
    );
  } catch (e) {
    console.error(e);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
}

export async function storeLogout(c: AuthContext) {
  const authResponse = await storeCheckAuth(c);
  if (authResponse) {
    return authResponse; // 認証に失敗した場合はそのままレスポンスを返す
  }
  const session = await c.get("session");

  try {
    session.deleteSession();
    console.log("session", session.get("uuid"));
    return c.json(
      {
        message: "Logged out",
      },
      200
    );
  } catch (e) {
    console.error(e);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
}
