import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./columns.helpers";

export const categoriesTable = sqliteTable("categories", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	...timestamps,
});

export const categories = categoriesTable;

export type InsertCategory = typeof categoriesTable.$inferInsert;
export type SelectCategory = typeof categoriesTable.$inferSelect;
