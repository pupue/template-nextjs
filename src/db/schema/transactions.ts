import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categoriesTable } from "./categories";
import { timestamps } from "./columns.helpers";

export const transactionsTable = sqliteTable(
	"transactions",
	{
		id: int().primaryKey({ autoIncrement: true }),
		type: text().$type<"income" | "expense">().notNull(),
		amount: int().notNull(),
		date: text().notNull(),
		memo: text(),
		categoryId: int("category_id").references(() => categoriesTable.id),
		...timestamps,
	},
	(t) => [index("idx_transactions_date").on(t.date)],
);

export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type SelectTransaction = typeof transactionsTable.$inferSelect;
