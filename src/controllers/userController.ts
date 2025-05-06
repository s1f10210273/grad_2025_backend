import type { Context } from "hono";
import { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";

type UserContext = Context<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>;

export async function userRegister(c: UserContext) {
  try {
    const body = await c.req.json();

    // todo: 登録処理を追加
    const userId = 123;

    const session = await c.get("session");
    await session.set("uuid", userId.toString());
    await session.set("role", "user");

    return c.json(
      {
        message: "user registered successfully",
        userId: userId,
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
