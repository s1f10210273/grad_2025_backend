import { type UserInsert, usersTable } from "../db/user.js";
import { eq, isNull } from "drizzle-orm";
import { db } from "../db.js";

export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email) && isNull(usersTable.deleted_at))
    .limit(1);
  return user;
};

export const existsUserByEmail = async (email: string): Promise<boolean> => {
  const [user] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email) && isNull(usersTable.deleted_at))
    .limit(1);
  return !!user;
};

export const existsUserByName = async (name: string): Promise<boolean> => {
  const [user] = await db
    .select({ name: usersTable.name })
    .from(usersTable)
    .where(eq(usersTable.name, name) && isNull(usersTable.deleted_at))
    .limit(1);
  return !!user;
};

export const registerUser = async (user: UserInsert) => {
  await db.insert(usersTable).values(user);
};
