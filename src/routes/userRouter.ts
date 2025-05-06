import { OpenAPIHono } from "@hono/zod-openapi";
import { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import { userRegister } from "../controllers/userController.js";
import { registerUserRoute } from "./openapi/registerUserRoute.js";
import { validateUserRegister } from "../middlewares/validateUserRegister.js";

export const userRouter = new OpenAPIHono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

userRouter.get("/", (c) => c.text("user dir"));

// /register
// middlewareでバリデーションを行った後に登録
userRouter.use("/register", validateUserRegister);
userRouter.openapi(registerUserRoute, userRegister);
