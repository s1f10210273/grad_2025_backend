import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import { storeLogin, storeLogout, storeRegister } from "../controllers/storeController.js";
import type { SessionDataTypes } from "../index.js";
import { validateStoreRegister } from "../middlewares/validateStoreRegister.js";
import {
  loginRoute,
  logoutRoute,
  registerRoute,
} from "./openapi/storeRoute.js";

export const storeRouter = new OpenAPIHono<{
	Variables: {
		session: Session<SessionDataTypes>;
	};
}>();

// /register
storeRouter.use("/register", validateStoreRegister);
storeRouter.openapi(registerRoute, storeRegister);

// /login
storeRouter.openapi(loginRoute, storeLogin);

// /login
storeRouter.openapi(logoutRoute, storeLogout);
