import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import {
  createOrderRoute,
  getOrderHistoryRoute,
} from "./openapi/orderRoute.js";
import {
  getOrderHistory,
  orderRegister,
} from "../controllers/orderController.js";

export const orderRouter = new OpenAPIHono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

orderRouter.openapi(createOrderRoute, orderRegister);
orderRouter.openapi(getOrderHistoryRoute, getOrderHistory);
