"use client";

import { useHydrateAtoms } from "jotai/utils";
import { useState } from "react";
import { Button, Form } from "react-aria-components";
import type { SelectCategory } from "@/db/schema";
import { categoriesAtom } from "@/store/categories";
import AmountField from "./_components/amout-field";
import CategoryField from "./_components/category-field";
import DateField from "./_components/date-field";
import TypeField from "./_components/type-field";
import { useCategory } from "./_hooks/use-category";

type Props = {
	categories: SelectCategory[];
};

export default function TransactionForm({ categories }: Props) {
	// サーバから受け取ったカテゴリをjotaiに保存
	useHydrateAtoms([[categoriesAtom, categories]]);
	const { type } = useCategory();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const formData = new FormData(e.target as HTMLFormElement);

			// API呼び出し
			const response = await fetch("/api/transactions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type,
					amount: parseFloat(
						(formData.get("amount") as string).replace(/,/g, ""),
					),
					date: formData.get("date") as string,
					memo: null,
					categoryId: formData.get("categoryId") as string,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || "取引の追加に失敗しました");
				setIsSubmitting(false);
				return;
			}
		} catch (error) {
			console.error("取引追加エラー:", error);
			alert("取引の追加に失敗しました");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form
			onSubmit={handleSubmit}
			className="overflow-y-scroll bg-white p-6 rounded-md"
		>
			<div className="space-y-4">
				<DateField />
				<TypeField />
				<AmountField />
				<CategoryField />
				<div className="col-span-2 flex justify-center">
					<Button
						type="submit"
						isDisabled={isSubmitting}
						className="min-w-36 rounded-md bg-button-primary text-sm font-bold text-white p-4 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "追加中..." : "追加"}
					</Button>
				</div>
			</div>
		</Form>
	);
}
