import type { z } from "@hono/zod-openapi";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const storeTable = mysqlTable("stores", {
  uuid: varchar("uuid", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  deleted_at: timestamp("deleted_at"),
});

export const storeSelectSchema = createSelectSchema(storeTable);
export const storeInsertSchema = createInsertSchema(storeTable);

export type StoreInsert = z.infer<typeof storeInsertSchema>;
