import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { config } from "./helpers/env.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: config.port as number,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
