import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "../models/userModel.js";
import { getOrderHistory } from "../controllers/orderController.js";
import { getOrders } from "../models/orderModel.js";

export const mcpRouter  = new OpenAPIHono<{
	Variables: {
		session: Session<SessionDataTypes>;
	};
}>();

mcpRouter.post("/orderHistory", async (c) => {
  try {
    const body = await c.req.json();
    const email: string = body.user_email;
    const password: string = body.user_password;

    // ユーザーの存在確認
    const user = await findUserByEmail(email);
    if (!user) {
      return c.json(
        {
          success: false,
          message: "Invalid email",
        },
        400
      );
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return c.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        400
      );
    }

    // 注文履歴の取得
    const orderHistory = await getOrders(user.uuid);
    console.log(orderHistory);

    if (!orderHistory) {
      return c.json(
        {
          success: false,
          message: "No order history found",
        },
        404 
      );
    }

    return c.json({ success: true, data: orderHistory }, 200);
  } catch (e) {
    console.error(e);
    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500
    );
  }
});

