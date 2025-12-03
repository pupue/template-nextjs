"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
	Button,
	Dialog,
	DialogTrigger,
	FieldError,
	Input,
	Modal,
	TextField,
} from "react-aria-components";
import type { SelectCategory } from "@/db/schema";
import { cn } from "@/utils/cn";

type Props = {
	categories: SelectCategory[];
	setCategories: (categories: SelectCategory[]) => void;
	onCategoryAdded: (categoryId: number) => void;
};

export default function CategoryAddButton({
	categories,
	setCategories,
	onCategoryAdded,
}: Props) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");

	async function handleAddCategory() {
		if (!newCategoryName.trim()) return;

		try {
			const response = await fetch("/api/categories", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: newCategoryName.trim() }),
			});

			if (!response.ok) {
				console.error("カテゴリ追加エラー:", response.statusText);
			}

			const newCategory = await response.json();
			setCategories([newCategory, ...categories]);
			setNewCategoryName("");
			setIsDialogOpen(false);
			onCategoryAdded(newCategory.id);
		} catch (error) {
			console.error("カテゴリ追加エラー:", error);
			alert("カテゴリの追加に失敗しました");
		}
	}

	return (
		<DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<Button
				className={cn(
					"bg-white text-xs rounded-lg border p-2 cursor-pointer border-primary",
					"hover:bg-primary/10 flex items-center gap-1",
				)}
			>
				<Plus size={16} />
			</Button>
			<Modal
				isDismissable
				className="bg-white border border-primary rounded-lg p-6 shadow-lg max-w-md w-full mx-4"
			>
				<Dialog>
					<div className="space-y-4">
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
									setIsDialogOpen(false);
									setNewCategoryName("");
								}}
								className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								キャンセル
							</Button>
							<Button
								onPress={handleAddCategory}
								className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
							>
								追加
							</Button>
						</div>
					</div>
				</Dialog>
			</Modal>
		</DialogTrigger>
	);
}
