import dotenv from "dotenv";

dotenv.config({ path: "env/.env.development" });

export const config = {
	secret: process.env.SECRET_KEY || "this_is_a_secure_key_with_32_chars!!",
	port: process.env.PORT || 3000,
	db: {
		host: process.env.DB_HOST || "localhost",
		user: process.env.MYSQL_USER || "my_db_username",
		password: process.env.MYSQL_PASSWORD || "my_db_password",
		database: process.env.MYSQL_DATABASE || "my_dbname",
	},
};
