import type { Session } from "@jcs224/hono-sessions";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { v4 as uuidv4 } from "uuid";
import type { SessionDataTypes } from "../index.js";

export const testRouter = new Hono<{
	Variables: {
		session: Session<SessionDataTypes>;
	};
}>();

testRouter.get("/", (c) => c.text("test dir"));

// Cookieを表示
testRouter.get("/display-cookie", (c) => {
	const cookie = getCookie(c, "cid");
	return c.json({ cookie });
});

// sessionセットのテスト
testRouter.get("/set-session", async (c) => {
	const session = await c.get("session");
	const uuid = uuidv4();
	await session.set("uuid", uuid);
	await session.set("role", "user");

	return c.json({
		message: "Session data set successfully",
		data: {
			uuid: uuid,
		},
	});
});

// セットしたセッションを表示して確認
testRouter.get("/display-session", async (c) => {
	const session = c.get("session");

	const savedUuid = await session.get("uuid");
	const savedRole = await session.get("role");

	return c.json({
		message: "Session data set successfully",
		data: {
			uuid: savedUuid,
			role: savedRole,
		},
	});
});
