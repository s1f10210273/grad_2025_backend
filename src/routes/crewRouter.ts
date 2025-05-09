import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import { validateCrewRegister } from "../middlewares/validateCrewRegister.js";
import { loginRoute, logoutRoute, registerRoute } from "./openapi/crewRoute.js";
import {
  crewLogin,
  crewLogout,
  crewRegister,
} from "../controllers/crewController.js";

export const crewRouter = new OpenAPIHono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

// /register
crewRouter.use("/register", validateCrewRegister);
crewRouter.openapi(registerRoute, crewRegister);

// /login
crewRouter.openapi(loginRoute, crewLogin);

// /login
crewRouter.openapi(logoutRoute, crewLogout);
