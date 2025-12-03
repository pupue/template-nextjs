import { desc } from "drizzle-orm";
import { db } from "@/db";
import { categories, transactionsTable } from "@/db/schema";
import Container from "../container";
import TransactionsPageClientWrapper from "./transactions-page-client-wrapper";

export default async function TransactionsPage() {
	const [categoriesList, transactionsList] = await Promise.all([
		db.select().from(categories),
		db
			.select()
			.from(transactionsTable)
			.orderBy(desc(transactionsTable.date), desc(transactionsTable.id)),
	]);

	return (
		<Container>
			<TransactionsPageClientWrapper
				initialCategories={categoriesList}
				initialTransactions={transactionsList}
			/>
		</Container>
	);
}
