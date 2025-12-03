import { Link, List } from "lucide-react";
import { getAllCategories } from "@/actions/category";
import TransactionForm from "./transaction-form";

export default async function Home() {
	const categories = await getAllCategories();

	return (
		<div className="grid grid-rows-[auto_1fr] gap-4 max-w-sm mx-auto p-5 h-full">
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-center text-2xl font-bold text-white">
							Add Your Income and Expense
						</h1>
						<p className="text-center text-xs text-white">
							Record your income or expense
						</p>
					</div>
					<Link
						href="/transactions"
						className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-primary hover:bg-gray-100 transition-colors"
						aria-label="取引一覧を見る"
					>
						<List size={24} />
					</Link>
				</div>
			</div>
			<TransactionForm categories={categories} />
		</div>
	);
}
