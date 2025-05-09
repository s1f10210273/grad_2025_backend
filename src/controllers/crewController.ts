import type { Session } from "@jcs224/hono-sessions";
import bcrypt from "bcryptjs";
import type { Context } from "hono";
import { v4 as uuidv4 } from "uuid";
import { sessionExpirationTime } from "../helpers/const.js";
import type { SessionDataTypes } from "../index.js";
import { crewCheckAuth } from "../middlewares/crewCheckAuth.js";
import { findCrewByEmail, registerCrew } from "../models/crewModel.js";
import type { CrewsInsert } from "../db/crew.js";

type CrewContext = Context<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>;

export async function crewRegister(c: CrewContext) {
  const body = await c.req.json();
  const name: string = body.name;
  const email: string = body.email;
  const password: string = body.password;

  try {
    const crewId = uuidv4();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const crew: CrewsInsert = {
      uuid: crewId,
      name: name,
      email: email,
      password: hashedPassword,
    };

    await registerCrew(crew);

    const session = await c.get("session");
    await session.set("uuid", crew.uuid);
    await session.set("role", "crew");
    await session.set("expirationTime", Date.now() + sessionExpirationTime);

    return c.json(
      {
        message: "crew registered successfully",
        userId: crew.uuid,
      },
      201
    );
  } catch (e) {
    console.error(e);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
}

export async function crewLogin(c: CrewContext) {
  const session = await c.get("session");
  if (session.get("uuid")) {
    console.log("session", session.get("uuid"));
    return c.json(
      {
        message: "crew is already logged in",
      },
      400
    );
  }

  try {
    const body = await c.req.json();
    const email: string = body.email;
    const password: string = body.password;

    const crew = await findCrewByEmail(email);
    if (!crew) {
      return c.json(
        {
          message: "Invalid email",
        },
        400
      );
    }

    const isPasswordValid = await bcrypt.compare(password, crew.password);
    if (isPasswordValid) {
      await session.set("uuid", crew.uuid);
      await session.set("role", "crew");
      await session.set("expirationTime", Date.now() + sessionExpirationTime);
      console.log("session", session.get("role"));
      return c.json(
        {
          message: "Login successful",
          userId: crew.uuid,
        },
        200
      );
    }
    return c.json(
      {
        message: "Invalid email or password",
      },
      400
    );
  } catch (e) {
    console.error(e);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
}

export async function crewLogout(c: CrewContext) {
  const authResponse = await crewCheckAuth(c);
  if (authResponse) {
    return authResponse; // 認証に失敗した場合はそのままレスポンスを返す
  }
  const session = await c.get("session");

  try {
    session.deleteSession();
    console.log("session", session.get("uuid"));
    return c.json(
      {
        message: "Logged out",
      },
      200
    );
  } catch (e) {
    console.error(e);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
}
