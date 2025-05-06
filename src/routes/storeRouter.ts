import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
import type { SessionDataTypes } from "../index.js";
import { storeCheckAuth } from "../middlewares/storeCheckAuth.js";
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
storeRouter.openapi(registerRoute, userRegister);

// /login
storeRouter.openapi(loginRoute, userLogin);

// /login
storeRouter.use("/login", storeCheckAuth);
storeRouter.openapi(logoutRoute, userLogout);
