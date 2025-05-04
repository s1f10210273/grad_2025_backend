import { Hono } from "hono";
import { getCookie } from "hono/cookie";

export const testRouter = new Hono();
testRouter.get("/", (c) => c.text("test dir"));

// Cookieを表示
testRouter.get("/display-cookie", (c) => {
  const cookie = getCookie(c, "cid");
  return c.json({ cookie });
});
