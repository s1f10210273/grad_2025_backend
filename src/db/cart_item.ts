import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const cartItemsTable = mysqlTable("cart_items", {
  id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull().primaryKey(),
  cart_id: bigint({ mode: "number", unsigned: true }).notNull(),
  item_id: bigint({ mode: "number", unsigned: true }).notNull(),
  item_name: varchar("item_name", { length: 255 }).notNull(),
  item_price: bigint({ mode: "number", unsigned: true }).notNull(),
  store_id: varchar("store_id", { length: 64 }).notNull(),
  quantity: bigint({ mode: "number", unsigned: true }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});

export const cartItemsSelectSchema = createSelectSchema(cartItemsTable);
export const cartItemsInsertSchema = createInsertSchema(cartItemsTable);