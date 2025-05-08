import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import { validateCrewRegister } from "../middlewares/validateCrewRegister.js";
import { loginRoute, logoutRoute, registerRoute } from "./openapi/crewRoute.js";
import { crewRegister } from "../controllers/crewController.js";
import { storeLogin, storeLogout } from "../controllers/storeController.js";

export const crewRouter = new OpenAPIHono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

// /register
crewRouter.use("/register", validateCrewRegister);
crewRouter.openapi(registerRoute, crewRegister);

// /login
crewRouter.openapi(loginRoute, storeLogin);

// /login
crewRouter.openapi(logoutRoute, storeLogout);
