"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import type { SelectCategory, SelectTransaction } from "@/db/schema";
import { categoriesAtom } from "@/store/categories";
import TransactionsPageClient from "./transactions-page-client";

type TransactionsPageClientWrapperProps = {
	initialCategories: SelectCategory[];
	initialTransactions: SelectTransaction[];
};

export default function TransactionsPageClientWrapper({
	initialCategories,
	initialTransactions,
}: TransactionsPageClientWrapperProps) {
	const setCategories = useSetAtom(categoriesAtom);

	useEffect(() => {
		// アクセス時にカテゴリを全件取得してjotaiに保存
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/categories");
				if (!response.ok) {
					console.error("カテゴリ取得エラー:", response.statusText);
					// エラー時は初期値を設定
					setCategories(initialCategories);
					return;
				}
				const data = await response.json();
				setCategories(data);
			} catch (error) {
				console.error("カテゴリ取得エラー:", error);
				// エラー時は初期値を設定
				setCategories(initialCategories);
			}
		};

		fetchCategories();
	}, [initialCategories, setCategories]);

	return <TransactionsPageClient initialTransactions={initialTransactions} />;
}
