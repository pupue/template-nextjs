"use client";

import type { CalendarDate } from "@internationalized/date";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Selection, ToggleButtonProps } from "react-aria-components";
import {
	Button,
	Calendar,
	CalendarCell,
	CalendarGrid,
	DatePicker,
	Dialog,
	FieldError,
	Form,
	Group,
	Input,
	Popover,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
} from "react-aria-components";
import InputLabel from "@/components/ui/input-label";
import type { SelectCategory, SelectTransaction } from "@/db/schema";
import { categoriesAtom, typeAtom } from "@/store/categories";
import { cn } from "@/utils/cn";
import CategoryPicker from "./_components/category-picker";

type Props = {
	onTransactionAdded?: (transaction: SelectTransaction) => void;
	categories: SelectCategory[];
};

export default function TransactionForm({
	onTransactionAdded,
	categories,
}: Props) {
	// サーバから受け取ったカテゴリをjotaiに保存
	useHydrateAtoms([[categoriesAtom, categories]]);

	const [selectedCategoryKeys, _] = useState<Selection>(new Set());
	const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
	const [selectedType, setSelectedType] = useAtom(typeAtom);

	const [amount, setAmount] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const today = new Date();
	const formatted = today
		.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})
		.replaceAll("/", "/");

	const handleTypeChange = (keys: Selection) => {
		const typeKeys = Array.from(keys);
		const type = typeKeys[0] === "income" ? "income" : "expense";
		setSelectedType(type);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// 金額の処理（カンマ区切りに対応）
			const amountNumber =
				amount && amount.trim() !== ""
					? parseFloat(amount.replace(/,/g, ""))
					: 0;

			// 日付の処理
			const dateValue = selectedDate
				? `${selectedDate.year}-${String(selectedDate.month).padStart(
						2,
						"0",
					)}-${String(selectedDate.day).padStart(2, "0")}`
				: formatted.replace(/\//g, "-");

			// タイプの処理
			const type = selectedType;

			// カテゴリIDの処理
			const categoryKeys = Array.from(selectedCategoryKeys);
			const categoryId =
				categoryKeys.length > 0 ? parseInt(categoryKeys[0] as string) : null;

			// API呼び出し
			const response = await fetch("/api/transactions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type,
					amount: amountNumber,
					date: dateValue,
					memo: null,
					categoryId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || "取引の追加に失敗しました");
				setIsSubmitting(false);
				return;
			}

			const newTransaction = await response.json();

			// 楽観的更新：コールバックを呼び出してリストに追加
			if (onTransactionAdded) {
				onTransactionAdded(newTransaction);
			}

			setSelectedDate(null);
			setSelectedType("income");
			setAmount("");
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
				{/* 日付 */}
				<div>
					<InputLabel id="date-label">日付</InputLabel>
					<DatePicker lang="ja" value={selectedDate} onChange={setSelectedDate}>
						<Group>
							<Button className="w-full border border-input rounded-md flex items-center justify-between gap-2 p-4">
								{selectedDate
									? `${selectedDate.year}/${String(selectedDate.month).padStart(
											2,
											"0",
										)}/${String(selectedDate.day).padStart(2, "0")}`
									: formatted}
								<ChevronDown size={16} />
							</Button>
						</Group>
						<Popover className="w-[var(--trigger-width)] shadow-md rounded-md bg-white p-2">
							<Dialog>
								<Calendar>
									<CalendarGrid className="w-full">
										{(date) => (
											<CalendarCell
												date={date}
												className={cn(
													"grid place-items-center rounded-md aspect-square",
													"hover:bg-primary/30",
													"data-selected:bg-primary data-selected:text-white",
													"not-data-disabled:bg-input/10 data-disabled:opacity-30 data-disabled:pointer-events-none",
												)}
											/>
										)}
									</CalendarGrid>
								</Calendar>
							</Dialog>
						</Popover>
					</DatePicker>
				</div>

				{/* 収支選択 */}
				<div>
					<InputLabel id="type-label">種類</InputLabel>
					<ToggleButtonGroup
						selectedKeys={new Set([selectedType])}
						onSelectionChange={handleTypeChange}
						aria-labelledby="type-label"
					>
						<ShushiButton
							id="income"
							className="rounded-l-md data:selected:border-green-dark data-selected:bg-green-dark data-selected:text-white"
						>
							収入
						</ShushiButton>
						<ShushiButton
							id="expense"
							className="rounded-r-md data:selected:border-red-dark data-selected:bg-red-dark data-selected:text-white"
						>
							支出
						</ShushiButton>
					</ToggleButtonGroup>
				</div>

				{/* 金額 */}
				<div className="col-span-2">
					<InputLabel id="amount-label">金額</InputLabel>
					<TextField
						name="amount"
						type="decimal"
						value={amount}
						onChange={setAmount}
						className="text-md"
					>
						<Input
							placeholder="1,000"
							className="w-full border border-input rounded-md p-4 text-md"
						/>
						<FieldError />
					</TextField>
				</div>

				{/* カテゴリ */}
				<div>
					<InputLabel id="category-label">カテゴリ</InputLabel>
					<CategoryPicker />
				</div>

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

function ShushiButton({ className, ...props }: ToggleButtonProps) {
	return (
		<ToggleButton
			{...props}
			className={cn(
				"w-2/4 text-xs font-semibold p-4 border border-transparent bg-gray-100",
				className,
			)}
		>
			{props.children}
		</ToggleButton>
	);
}
