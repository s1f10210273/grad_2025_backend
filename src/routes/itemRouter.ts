import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";

export const itemRouter = new OpenAPIHono<{
	Variables: {
		session: Session<SessionDataTypes>;
	};
}>();

itemRouter.get("/", (c) => c.text("item dir"));