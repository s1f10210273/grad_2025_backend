import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { type CrewsInsert, crewsTable } from "../db/crew.js";

export const findCrewByEmail = async (email: string) => {
  const [crew] = await db
    .select()
    .from(crewsTable)
    .where(and(eq(crewsTable.email, email) && isNull(crewsTable.deleted_at)))
    .limit(1);
  return crew;
};

export const existsCrewByEmail = async (email: string): Promise<boolean> => {
  const [crew] = await db
    .select()
    .from(crewsTable)
    .where(and(eq(crewsTable.email, email), isNull(crewsTable.deleted_at)))
    .limit(1);
  return !!crew;
};

export const existsCrewByName = async (name: string): Promise<boolean> => {
  const [crew] = await db
    .select()
    .from(crewsTable)
    .where(and(eq(crewsTable.name, name), isNull(crewsTable.deleted_at)))
    .limit(1);
  return !!crew;
};

export const registerCrew = async (crew: CrewsInsert) => {
  await db.insert(crewsTable).values(crew);
};
