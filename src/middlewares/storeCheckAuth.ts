import { sessionExpirationTime } from "../helpers/const.js";
import type { AuthContext } from "../types/context.js";

export const storeCheckAuth = async (c: AuthContext) => {
  const session = await c.get("session");

  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const uuid = session.get("uuid");
  const role = session.get("role");
  const expirationTime = session.get("expirationTime");

  const now = Date.now();

  if (
    !uuid ||
    !role ||
    !expirationTime ||
    role !== "store" ||
    expirationTime < now
  ) {
    try {
      session.deleteSession();
      return c.json({ message: "Unauthorized" }, 401);
    } catch (e) {
      console.error(e);
      return c.json({ message: "Internal server error" }, 500);
    }
  }

  session.set("expirationTime", now + sessionExpirationTime);
  return null;
};
