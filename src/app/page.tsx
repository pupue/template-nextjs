import { db } from "@/db";
import { categories } from "@/db/schema";
// import HomeClient from "./home-client";
import Container from "./container";
import TransactionForm from "./transaction-form";

export default async function Home() {
	const categoriesList = await db.select().from(categories);

	return (
		<div className="grid grid-rows-[auto_1fr] gap-4 max-w-sm mx-auto p-5 h-full">
			<div className="space-y-2">
				<h1 className="text-center text-2xl font-bold text-white">
					Add Your Income and Expense
				</h1>
				<p className="text-center text-xs text-white">
					Record your income or expense
				</p>
			</div>
			<TransactionForm categories={categoriesList} />
		</div>
	);

	// return <HomeClient categories={categoriesList} />;
}
