import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import { cartRegister } from "../controllers/cartController.js";
import type { SessionDataTypes } from "../index.js";
import { cartAddRoute } from "./openapi/cartRoute.js";

export const cartRouter = new OpenAPIHono<{
	Variables: {
		session: Session<SessionDataTypes>;
	};
}>();

cartRouter.openapi(cartAddRoute, cartRegister);