import type { Session } from "@jcs224/hono-sessions";
import type { Context } from "hono";
import { sessionExpirationTime } from "../helpers/const.js";
import type { SessionDataTypes } from "../index.js";

type crewContext = Context<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>;

export const crewCheckAuth = async (c: crewContext) => {
  const session = await c.get("session");

  if (!session) {
    return c.json({ message: "Unauthorized2" }, 401);
  }

  const uuid = session.get("uuid");
  const role = session.get("role");
  const expirationTime = session.get("expirationTime");

  const now = Date.now();

  if (
    !uuid ||
    !role ||
    !expirationTime ||
    role !== "crew" ||
    expirationTime < now
  ) {
    try {
      session.deleteSession();
      return c.json({ message: "Unauthorized1" }, 401);
    } catch (e) {
      console.error(e);
      return c.json({ message: "Internal server error" }, 500);
    }
  }

  session.set("expirationTime", now + sessionExpirationTime);
  return null;
};
