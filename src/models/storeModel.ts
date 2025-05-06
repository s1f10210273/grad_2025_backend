import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { type StoreInsert, storeTable } from "../db/store.js";

export const findStoreByEmail = async (email: string) => {
	const [store] = await db
		.select()
		.from(storeTable)
		.where(and(eq(storeTable.email, email) && isNull(storeTable.deleted_at)))
		.limit(1);
	return store;
};

export const existsStoreByEmail = async (email: string): Promise<boolean> => {
	const [store] = await db
		.select()
		.from(storeTable)
		.where(and(eq(storeTable.email, email), isNull(storeTable.deleted_at)))
		.limit(1);
	return !!store;
};

export const existsStoreByName = async (name: string): Promise<boolean> => {
	const [store] = await db
		.select()
		.from(storeTable)
		.where(and(eq(storeTable.name, name), isNull(storeTable.deleted_at)))
		.limit(1);
	return !!store;
};

export const registerStore = async (store: StoreInsert) => {
	await db.insert(storeTable).values(store);
};
