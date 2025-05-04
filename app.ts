import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { config } from "@/helpers/env.ts";
import { testRouter } from "@/routes/testRouter.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/test", testRouter);

serve({
  fetch: app.fetch,
  port: config.port as number,
});

console.log(`app is run on http://localhost:${config.port}`);
