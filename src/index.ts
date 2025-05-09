import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { CookieStore, Session, sessionMiddleware } from "@jcs224/hono-sessions";
import { sessionExpirationTime } from "./helpers/const.js";
import { config } from "./helpers/env.js";
import { cartRouter } from "./routes/cartRouter.js";
import { itemRouter } from "./routes/itemRouter.js";
import { openApiCartTag } from "./routes/openapi/cartRoute.js";
import { openApiItemTag } from "./routes/openapi/itemRoute.js";
import { openApiStoreTag } from "./routes/openapi/storeRoute.js";
import { openApiUserTag } from "./routes/openapi/userRoute.js";
import { storeRouter } from "./routes/storeRouter.js";
import { userRouter } from "./routes/userRouter.js";
import type { sessionRole } from "./types/roleTypes.js";
import { serveStatic } from "@hono/node-server/serve-static";
import { orderRouter } from "./routes/orderRoute.js";
import { openApiOrderTag } from "./routes/openapi/orderRoute.js";
import { crewRouter } from "./routes/crewRouter.js";
import { openApiCrewTag } from "./routes/openapi/crewRoute.js";
import { cors } from "hono/cors";
import { authRouter } from "./routes/authRouter.js";
import { openApiAuthTag } from "./routes/openapi/authRoute.js";

export type SessionDataTypes = {
  uuid: string;
  role: sessionRole;
  expirationTime: number;
};

const app = new OpenAPIHono<{
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

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    // cookieを送信するための設定
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// 静的ファイルの提供を設定
app.use("/uploads/*", serveStatic({ root: "./" }));
// ここにAPIを追加していく
app.route("/api/users", userRouter);
app.route("/api/stores", storeRouter);
app.route("/api/items", itemRouter);
app.route("/api/carts", cartRouter);
app.route("/api/orders", orderRouter);
app.route("/api/crews", crewRouter);
app.route("/api/auth", authRouter);

// OpenAPIの設定
app.get("/swagger", swaggerUI({ url: "/api-docs" }));

app.doc("/api-docs", {
  openapi: "3.0.0",
  info: {
    title: "Grad 2025 Backend API",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: "開発サーバー",
    },
  ],
  tags: [
    openApiUserTag,
    openApiStoreTag,
    openApiItemTag,
    openApiCartTag,
    openApiOrderTag,
    openApiCrewTag,
    openApiAuthTag,
  ],
});

// APIインデックスページ
app.get("/api", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Documentation</title>
        <style>
          body { font-family: sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { color: #333; }
          .card { border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 20px; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>API Documentation</h1>
          <div class="card">
            <h2>API仕様</h2>
            <p><a href="/swagger" target="_blank">Swagger UI</a></p>
            <p><a href="/api-docs" target="_blank">OpenAPI仕様 (JSON)</a></p>
          </div>
        </div>
      </body>
    </html>
  `);
});

serve({
  fetch: app.fetch,
  port: config.port as number,
});

console.log(`app is run on http://localhost:${config.port}`);
console.log(`API Documentation: http://localhost:${config.port}/api`);
console.log(`Swagger UI: http://localhost:${config.port}/swagger`);
