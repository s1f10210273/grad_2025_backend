import type { Session } from "@jcs224/hono-sessions";
import bcrypt from "bcryptjs";
import type { Context } from "hono";
import { v4 as uuidv4 } from "uuid";
import type { UserInsert } from "../db/user.js";
import { sessionExpirationTime } from "../helpers/const.js";
import type { SessionDataTypes } from "../index.js";
import { userCheckAuth } from "../middlewares/userCheckAuth.js";
import { findUserByEmail, registerUser } from "../models/userModel.js";

type UserContext = Context<{
	Variables: {
		session: Session<SessionDataTypes>;
	};
}>;

export async function userRegister(c: UserContext) {
	const body = await c.req.json();
	const name: string = body.name;
	const address: string = body.address;
	const email: string = body.email;
	const password: string = body.password;

	try {
		const storeId = uuidv4();
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);
		const store: UserInsert = {
			uuid: storeId,
			name: name,
			address: address,
			email: email,
			password: hashedPassword,
		};

		await registerUser(store);

		const session = await c.get("session");
		await session.set("uuid", store.uuid);
		await session.set("role", "user");
		await session.set("expirationTime", Date.now() + sessionExpirationTime);

		return c.json(
			{
				message: "user registered successfully",
				userId: store.uuid,
			},
			201,
		);
	} catch (e) {
		console.error(e);
		return c.json(
			{
				message: "Internal server error",
			},
			500,
		);
	}
}

export async function userLogin(c: UserContext) {
	const session = await c.get("session");
	if (session.get("uuid")) {
		console.log("session", session.get("uuid"));
		return c.json(
			{
				message: "User is already logged in",
			},
			400,
		);
	}

	try {
		const body = await c.req.json();
		const email: string = body.email;
		const password: string = body.password;

		const store = await findUserByEmail(email);
		if (!store) {
			return c.json(
				{
					message: "Invalid email",
				},
				400,
			);
		}

		const isPasswordValid = await bcrypt.compare(password, store.password);
		if (isPasswordValid) {
			await session.set("uuid", store.uuid);
			await session.set("role", "user");
			await session.set("expirationTime", Date.now() + sessionExpirationTime);
			return c.json(
				{
					message: "Login successful",
					userId: store.uuid,
				},
				200,
			);
		}
		return c.json(
			{
				message: "Invalid email or password",
			},
			400,
		);
	} catch (e) {
		console.error(e);
		return c.json(
			{
				message: "Internal server error",
			},
			500,
		);
	}
}

export async function userLogout(c: UserContext) {
	const authResponse = await userCheckAuth(c);
  if (authResponse) {
    return authResponse;  // 認証に失敗した場合はそのままレスポンスを返す
  }
	const session = await c.get("session");

	try {
		session.deleteSession();
		console.log("session", session.get("uuid"));
		return c.json(
			{
				message: "Logged out",
			},
			200,
		);
	} catch (e) {
		console.error(e);
		return c.json(
			{
				message: "Internal server error",
			},
			500,
		);
	}
}
