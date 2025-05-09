import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import { checkAuthRoute } from "./openapi/authRoute.js";
import { checkAuth } from "../controllers/authController.js";

export const authRouter = new OpenAPIHono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

authRouter.openapi(checkAuthRoute, checkAuth);
