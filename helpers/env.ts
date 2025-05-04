import dotenv from "dotenv";

dotenv.config({ path: "env/.env.development" });

export const config = {
  secret: process.env.SECRET_KEY || "defaultSecretKey",
  port: process.env.PORT || 3000,
};
