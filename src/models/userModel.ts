import { type UserInsert, usersTable } from "../db/user.js";
import { and, eq, isNull } from "drizzle-orm";
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
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deleted_at)))
    .limit(1);
  return !!user;
};

export const existsUserByName = async (name: string): Promise<boolean> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.name, name), isNull(usersTable.deleted_at)))
    .limit(1);
  return !!user;
};

export const registerUser = async (user: UserInsert) => {
  await db.insert(usersTable).values(user);
};
