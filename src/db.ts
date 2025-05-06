import mysql from "mysql2/promise";
import { config } from "./helpers/env.js";
import { drizzle } from "drizzle-orm/mysql2";

export const pool = mysql.createPool({
  host: config.db.host || "localhost",
  user: config.db.user || "my_db_username",
  password: config.db.password || "my_db_password",
  database: config.db.database || "my_dbname",
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(pool);
