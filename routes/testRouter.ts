import { Hono } from "hono";

export const testRouter = new Hono();
testRouter.get("/", (c) => c.text("test dir"));
