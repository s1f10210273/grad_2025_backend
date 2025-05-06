import { OpenAPIHono } from "@hono/zod-openapi";
import { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import {
  userLogin,
  userRegister,
  userLogout,
} from "../controllers/userController.js";
import {
  registerUserRoute,
  loginRoute,
  logoutRoute,
} from "./openapi/userRoute.js";
import { validateUserRegister } from "../middlewares/validateUserRegister.js";
import { userCheckAuth } from "../middlewares/userCheckAuth.js";

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
