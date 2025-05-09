import type { Session } from "@jcs224/hono-sessions";
import type { Context } from "hono";
import type { SessionDataTypes } from "../index.js";

export type AuthContext = Context<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>;
