"use client";

import type { CalendarDate } from "@internationalized/date";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import type {
	ListBoxItemProps,
	Selection,
	ToggleButtonProps,
} from "react-aria-components";
import {
	Button,
	Calendar,
	CalendarCell,
	CalendarGrid,
	DatePicker,
	Dialog,
	DialogTrigger,
	FieldError,
	Form,
	Group,
	Input,
	ListBox,
	ListBoxItem,
	Modal,
	Popover,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
} from "react-aria-components";
import InputLabel from "@/components/ui/input-label";
import type { SelectCategory, SelectTransaction } from "@/db/schema";
import { cn } from "@/utils/cn";

type TransactionFormProps = {
	categories: SelectCategory[];
	onTransactionAdded?: (transaction: SelectTransaction) => void;
};

export default function TransactionForm({
	categories: initialCategories,
	onTransactionAdded,
}: TransactionFormProps) {
	const [categories, setCategories] =
		useState<SelectCategory[]>(initialCategories);
	const [selectedCategoryKeys, setSelectedCategoryKeys] = useState<Selection>(
		new Set(),
	);
	const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
	const [selectedType, setSelectedType] = useState<Selection>(
		new Set(["income"]),
	);
	const [amount, setAmount] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");

	const today = new Date();
	const formatted = today
		.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})
		.replaceAll("/", "/");

	const handleSelectionChange = (keys: Selection) => {
		const keyArray = Array.from(keys);
		// "add-new"が選択された場合は新規追加ダイアログを開く
		if (keyArray.includes("add-new")) {
			setIsCategoryDialogOpen(true);
			// 選択をクリア
			setSelectedCategoryKeys(new Set());
		} else {
			setSelectedCategoryKeys(keys);
		}
	};

	const handleCategoryAdded = async (categoryName: string) => {
		if (!categoryName.trim()) return;

		try {
			const response = await fetch("/api/categories", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: categoryName.trim() }),
			});

			if (!response.ok) {
				console.error("カテゴリ追加エラー:", response.statusText);
				alert("カテゴリの追加に失敗しました");
				return;
			}

			const newCategory = await response.json();
			setCategories([newCategory, ...categories]);
			setNewCategoryName("");
			setIsCategoryDialogOpen(false);
			// 新しく追加したカテゴリを選択
			setSelectedCategoryKeys(new Set([newCategory.id.toString()]));
		} catch (error) {
			console.error("カテゴリ追加エラー:", error);
			alert("カテゴリの追加に失敗しました");
		}
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
			const typeKeys = Array.from(selectedType);
			const type = typeKeys[0] === "income" ? "income" : "expense";

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

			// 成功時の処理
			setSelectedCategoryKeys(new Set());
			setSelectedDate(null);
			setSelectedType(new Set(["income"]));
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
						selectedKeys={selectedType}
						onSelectionChange={setSelectedType}
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
					<ListBox
						selectionMode="single"
						selectedKeys={selectedCategoryKeys}
						onSelectionChange={handleSelectionChange}
						aria-labelledby="category-label"
						className="w-full grid grid-cols-3 gap-2"
					>
						{categories.map((category) => (
							<CategoryListItem
								key={category.id}
								id={category.id.toString()}
								className="data-selected:bg-primary data-selected:text-white data-selected:border-primary"
							>
								<span className="text-xs">{category.name}</span>
							</CategoryListItem>
						))}
						<CategoryListItem id="add-new">
							<Plus size={20} />
						</CategoryListItem>
					</ListBox>
				</div>

				{/* 新規カテゴリ追加ダイアログ */}
				<DialogTrigger
					isOpen={isCategoryDialogOpen}
					onOpenChange={setIsCategoryDialogOpen}
				>
					<Modal
						isDismissable
						className="bg-white border border-primary rounded-lg p-6 shadow-lg max-w-md w-full mx-4"
					>
						<Dialog>
							<div className="space-y-4">
								<InputLabel id="new-category-label">新規カテゴリ</InputLabel>
								<TextField
									value={newCategoryName}
									onChange={setNewCategoryName}
									isRequired
									autoFocus
								>
									<Input
										placeholder="カテゴリ名を入力"
										className="w-full border border-input rounded-md p-2"
									/>
									<FieldError />
								</TextField>
								<div className="flex gap-2 justify-end">
									<Button
										onPress={() => {
											setIsCategoryDialogOpen(false);
											setNewCategoryName("");
										}}
										className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
									>
										キャンセル
									</Button>
									<Button
										onPress={() => handleCategoryAdded(newCategoryName)}
										className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
									>
										追加
									</Button>
								</div>
							</div>
						</Dialog>
					</Modal>
				</DialogTrigger>

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

function CategoryListItem({
	children,
	className,
	...props
}: ListBoxItemProps & {
	children: React.ReactNode;
}) {
	return (
		<ListBoxItem
			{...props}
			className={cn(
				"flex items-center justify-center rounded-md cursor-pointer border border-input p-4",
				className,
			)}
		>
			{children}
		</ListBoxItem>
	);
}
