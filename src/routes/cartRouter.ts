import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import {
  cartRegister,
  getCarts,
  updateCarts,
} from "../controllers/cartController.js";
import type { SessionDataTypes } from "../index.js";
import {
  cartAddRoute,
  cartGetRoute,
  cartPutRoute,
} from "./openapi/cartRoute.js";

export const cartRouter = new OpenAPIHono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

cartRouter.openapi(cartAddRoute, cartRegister);
cartRouter.openapi(cartGetRoute, getCarts);
cartRouter.openapi(cartPutRoute, updateCarts);
