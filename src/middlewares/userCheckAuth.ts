import type { MiddlewareHandler } from "hono";
import { sessionExpirationTime } from "../helpers/const.js";

export const userCheckAuth: MiddlewareHandler = async (c, next) => {
	const session = await c.get("session");

	const uuid = session.get("uuid");
	const role = session.get("role");
	const expirationTime = session.get("expirationTime");

	const now = Date.now();

	if (
		!uuid ||
		!role ||
		!expirationTime ||
		role !== "user" ||
		expirationTime < now
	) {
		session.deleteSession();
		return c.json({ message: "Unauthorized" }, 401);
	}

	session.set("expirationTime", now + sessionExpirationTime);
	next();
};
