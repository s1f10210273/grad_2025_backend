import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import {
	userLogin,
	userLogout,
	userRegister,
} from "../controllers/userController.js";
import type { SessionDataTypes } from "../index.js";
import { userCheckAuth } from "../middlewares/userCheckAuth.js";
import { validateUserRegister } from "../middlewares/validateUserRegister.js";
import {
	loginRoute,
	logoutRoute,
	registerUserRoute,
} from "./openapi/userRoute.js";

export const userRouter = new OpenAPIHono<{
	Variables: {
		session: Session<SessionDataTypes>;
	};
}>();

userRouter.get("/", (c) => c.text("user dir"));

// /register
userRouter.use("/register", validateUserRegister);
userRouter.openapi(registerUserRoute, userRegister);

// /login
userRouter.openapi(loginRoute, userLogin);

// /login
userRouter.use("/login", userCheckAuth);
userRouter.openapi(logoutRoute, userLogout);
