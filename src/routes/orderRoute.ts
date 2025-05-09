import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import {
  createOrderRoute,
  getOrderAvailableRoute,
  getOrderHistoryRoute,
  postOrderCompleteRoute,
} from "./openapi/orderRoute.js";
import {
  getOrderHistory,
  orderAvailable,
  orderComplete,
  orderRegister,
} from "../controllers/orderController.js";

export const orderRouter = new OpenAPIHono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

orderRouter.openapi(createOrderRoute, orderRegister);
orderRouter.openapi(getOrderHistoryRoute, getOrderHistory);
orderRouter.openapi(postOrderCompleteRoute, orderComplete);
orderRouter.openapi(getOrderAvailableRoute, orderAvailable);
