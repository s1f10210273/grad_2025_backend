import type { Context } from "hono";
import { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import { userInsertSchema } from "../db/user.js";
import { registerUser } from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";

type UserContext = Context<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>;

export async function userRegister(c: UserContext) {
  try {
    const body = await c.req.json();
    const uuid = uuidv4();
    const userData = userInsertSchema.parse({ ...body, uuid });

    await registerUser(userData);

    const session = await c.get("session");
    await session.set("uuid", userData.uuid);
    await session.set("role", "user");

    return c.json(
      {
        message: "user registered successfully",
        userId: userData.uuid,
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
}
