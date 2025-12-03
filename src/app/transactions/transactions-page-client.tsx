"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { SelectTransaction } from "@/db/schema";
import TransactionList from "../transaction-list";

type TransactionsPageClientProps = {
	initialTransactions: SelectTransaction[];
};

export default function TransactionsPageClient({
	initialTransactions,
}: TransactionsPageClientProps) {
	const [transactions, setTransactions] =
		useState<SelectTransaction[]>(initialTransactions);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const handleTransactionsLoaded = (
		loadedTransactions: SelectTransaction[],
	) => {
		setTransactions(loadedTransactions);
	};

	return (
		<div className="grid grid-rows-[auto_1fr] gap-4 h-full">
			<div className="space-y-2 pt-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-center text-2xl font-bold text-white">
							取引一覧
						</h1>
						<p className="text-center text-xs text-white">All Transactions</p>
					</div>
					<Link
						href="/"
						className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-primary hover:bg-gray-100 transition-colors"
						aria-label="取引を追加"
					>
						<Plus size={24} />
					</Link>
				</div>
			</div>
			<div
				ref={scrollContainerRef}
				className="overflow-y-auto bg-white rounded-md p-4"
			>
				<TransactionList
					transactions={transactions}
					onTransactionsLoaded={handleTransactionsLoaded}
					scrollContainerRef={scrollContainerRef}
				/>
			</div>
		</div>
	);
}
