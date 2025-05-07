import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// todo:foreignKeyの設定しておいた方がいい
export const cartsTable = mysqlTable("carts", {
  id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull().primaryKey(),
  user_id: varchar("user_id", { length: 64 }).notNull(),
  ordered_at: timestamp("ordered_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});

export const cartsSelectSchema = createSelectSchema(cartsTable);
export const cartsInsertSchema = createInsertSchema(cartsTable);