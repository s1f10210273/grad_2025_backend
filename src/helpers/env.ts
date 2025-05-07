import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../env/.env.development") });

export const config = {
  secret: process.env.SECRET_KEY || "this_is_a_secure_key_with_32_chars!!",
  port: Number(process.env.PORT) || 3000,
  // apiのURLを指定
  url: `http://localhost:${process.env.PORT}` || "http://localhost:3000",
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.MYSQL_USER || "my_db_username",
    password: process.env.MYSQL_PASSWORD || "my_db_password",
    database: process.env.MYSQL_DATABASE || "my_dbname",
  },
};
