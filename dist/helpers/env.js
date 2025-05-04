import dotenv from "dotenv";
dotenv.config({ path: "env/.env.development" });
export const config = {
    secret: process.env.SECRET_KEY || "this_is_a_secure_key_with_32_chars!!",
    port: process.env.PORT || 3000,
};
