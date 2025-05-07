import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import { getAllItem, storeAddItem } from "../controllers/itemController.js";
import type { SessionDataTypes } from "../index.js";
import { getAllItemsRoute, storeAddItemRoute } from "./openapi/itemRoute.js";

export const itemRouter = new OpenAPIHono<{
	Variables: {
		session: Session<SessionDataTypes>;
	};
}>();

itemRouter.openapi(storeAddItemRoute, storeAddItem);
itemRouter.openapi(getAllItemsRoute, getAllItem);