import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/*.ts",
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "my_db_username",
    password: "my_db_password",
    database: "my_dbname",
  },
});
