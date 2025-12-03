"use client";

import { useEffect, useRef } from "react";
import type { SelectCategory, SelectTransaction } from "@/db/schema";
import { cn } from "@/utils/cn";

type TransactionListProps = {
	categories: SelectCategory[];
	transactions: SelectTransaction[];
	onTransactionsLoaded: (transactions: SelectTransaction[]) => void;
	scrollContainerRef: React.RefObject<HTMLDivElement | null>;
};

export default function TransactionList({
	categories,
	transactions,
	onTransactionsLoaded,
	scrollContainerRef,
}: TransactionListProps) {
	const listRef = useRef<HTMLDivElement>(null);
	const isInitialLoad = useRef(true);
	const hasFetched = useRef(false);
	const onTransactionsLoadedRef = useRef(onTransactionsLoaded);

	// コールバック関数の参照を更新
	useEffect(() => {
		onTransactionsLoadedRef.current = onTransactionsLoaded;
	}, [onTransactionsLoaded]);

	useEffect(() => {
		// 初回のみデータを取得
		if (hasFetched.current) return;

		const fetchTransactions = async () => {
			try {
				const response = await fetch("/api/transactions");
				if (!response.ok) {
					console.error("取引取得エラー:", response.statusText);
					return;
				}
				const data = await response.json();
				onTransactionsLoadedRef.current(data);
				hasFetched.current = true;
			} catch (error) {
				console.error("取引取得エラー:", error);
			}
		};

		fetchTransactions();
	}, []);

	// スクロール位置を一番下（最新の取引が見える位置）に設定
	useEffect(() => {
		if (transactions.length > 0 && scrollContainerRef.current) {
			// DOMの更新を待ってからスクロール
			const scrollToBottom = () => {
				const container = scrollContainerRef.current;
				if (container) {
					// スクロール位置を一番下に設定
					container.scrollTop = container.scrollHeight;
				}
			};

			// requestAnimationFrameでDOMの更新を待つ（2回呼び出して確実に）
			requestAnimationFrame(() => {
				requestAnimationFrame(scrollToBottom);
			});

			if (isInitialLoad.current) {
				isInitialLoad.current = false;
			}
		}
	}, [transactions.length, scrollContainerRef]);

	const getCategoryName = (categoryId: number | null) => {
		if (!categoryId) return "";
		const category = categories.find((cat) => cat.id === categoryId);
		return category?.name || "";
	};

	const isIncome = (type: string) => type === "income";

	if (transactions.length === 0) {
		return (
			<div className="flex justify-center items-center py-8">
				<div className="text-secondary text-sm">取引がありません</div>
			</div>
		);
	}

	return (
		<div ref={listRef} className="space-y-3">
			{transactions.map((transaction, index) => {
				const categoryName = getCategoryName(transaction.categoryId);
				return (
					<div key={transaction.id}>
						<div
							className={cn(
								"flex items-center border-l-4 py-4 p-2",
								isIncome(transaction.type)
									? "border-green-dark"
									: "border-red-dark",
							)}
						>
							<div className="flex-1">
								<div className="text-secondary text-xs mb-1">
									{transaction.date}
								</div>
								<div className="text-gray-900">
									{categoryName || "カテゴリなし"}
								</div>
							</div>
							<div className="text-right ml-4">
								<div
									className={cn(
										"text-sm font-bold",
										transaction.type === "income"
											? "text-green-dark"
											: "text-red-dark",
									)}
								>
									{transaction.type === "income" ? "¥ " : "- ¥ "}
									{transaction.amount.toLocaleString()}
								</div>
							</div>
						</div>
						{index < transactions.length - 1 && (
							<div className="border-b border-gray-100"></div>
						)}
					</div>
				);
			})}
		</div>
	);
}
