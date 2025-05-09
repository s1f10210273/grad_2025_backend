import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
import type { SessionDataTypes } from "../index.js";
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
userRouter.openapi(registerUserRoute, userRegister);

// /login
userRouter.openapi(loginRoute, userLogin);

// /logout
userRouter.openapi(logoutRoute, userLogout);
