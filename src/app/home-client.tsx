"use client";

import { useCallback, useRef, useState } from "react";
import type { SelectCategory, SelectTransaction } from "@/db/schema";
import Container from "./container";
import TransactionForm from "./transaction-form";
import TransactionList from "./transaction-list";

type HomeClientProps = {
	categories: SelectCategory[];
};

export default function HomeClient({ categories }: HomeClientProps) {
	const [transactions, setTransactions] = useState<SelectTransaction[]>([]);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const handleTransactionAdded = useCallback(
		(newTransaction: SelectTransaction) => {
			// 楽観的更新：新しい取引をリストの末尾に追加
			setTransactions((prev) => [...prev, newTransaction]);
		},
		[],
	);

	const handleTransactionsLoaded = useCallback(
		(loadedTransactions: SelectTransaction[]) => {
			// 初期データを昇順で設定（古いものが上、新しいものが下）
			const sorted = [...loadedTransactions].sort((a, b) => {
				// 日付で昇順ソート、同じ日付の場合はIDで昇順
				if (a.date !== b.date) {
					return a.date.localeCompare(b.date);
				}
				return a.id - b.id;
			});
			setTransactions(sorted);
		},
		[],
	);

	return (
		<div className="h-svh py-4 overflow-hidden">
			<Container>
				<div className="grid grid-rows-[auto_1fr] h-full">
					<div className="border-b border-gray-100 pb-4 mb-4">
						<TransactionForm
							categories={categories}
							onTransactionAdded={handleTransactionAdded}
						/>
					</div>
					<div ref={scrollContainerRef} className="overflow-y-auto min-h-0">
						<TransactionList
							categories={categories}
							transactions={transactions}
							onTransactionsLoaded={handleTransactionsLoaded}
							scrollContainerRef={scrollContainerRef}
						/>
					</div>
				</div>
			</Container>
		</div>
	);
}
