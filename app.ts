import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { config } from "@/helpers/env.ts";
import { testRouter } from "@/routes/testRouter.ts";
import { Session, sessionMiddleware, CookieStore } from "@jcs224/hono-sessions";
import { sessionExpirationTime } from "@/helpers/const.ts";
import type { sessionRole } from "./types/roleTypes.ts";

export type SessionDataTypes = {
  uuid: string;
  role: sessionRole;
  expirationTime: number;
};

const app = new Hono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

const store = new CookieStore();

app.use(
  "*",
  sessionMiddleware({
    store,
    // ブラウザに保存されるCookieの名前
    sessionCookieName: "cid",
    encryptionKey: config.secret,
    cookieOptions: {
      maxAge: sessionExpirationTime,
      // セッションの安全性を高めるための設定
      // これを使用すると、jsからのアクセスを防ぐことができる
      httpOnly: true,
    },
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/test", testRouter);

serve({
  fetch: app.fetch,
  port: config.port as number,
});

console.log(`app is run on http://localhost:${config.port}`);
