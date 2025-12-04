"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { ListBoxItemProps, Selection } from "react-aria-components";
import {
	Dialog,
	DialogTrigger,
	ListBox,
	ListBoxItem,
	Modal,
} from "react-aria-components";
import InputLabel from "@/components/ui/input-label";
import { cn } from "@/utils/cn";
import { useCategory } from "../_hooks/use-category";
import CategoryAddForm from "./category-add-form";

export default function CategoryField() {
	const { filteredCategories, type } = useCategory();
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	function handleSelectionChange(keys: Selection) {
		const keyArray = Array.from(keys);
		setSelectedCategoryId(keyArray[0] as string);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: tmp
	useEffect(() => {
		setSelectedCategoryId("");
	}, [type]);

	return (
		<>
			<input type="hidden" name="categoryId" value={selectedCategoryId} />

			<InputLabel id="category-label">カテゴリ</InputLabel>
			<ListBox
				selectionMode="single"
				selectedKeys={
					selectedCategoryId ? new Set([selectedCategoryId]) : new Set()
				}
				onSelectionChange={handleSelectionChange}
				aria-labelledby="category-label"
				className="w-full grid grid-cols-3 gap-2"
			>
				{filteredCategories.map((category) => (
					<CategoryListItem
						key={category.id}
						id={category.id.toString()}
						textValue={category.name}
						className="data-selected:bg-primary data-selected:text-white data-selected:border-primary"
					>
						<span className="text-xs">{category.name}</span>
					</CategoryListItem>
				))}
				<CategoryListItem onPress={() => setIsDialogOpen(true)}>
					<Plus size={20} />
				</CategoryListItem>
			</ListBox>

			<DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<Modal
					isDismissable
					className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4"
				>
					<Dialog>
						<CategoryAddForm
							onClose={() => setIsDialogOpen(false)}
							onCategoryAdded={(id) => {
								setSelectedCategoryId(id);
								setIsDialogOpen(false);
							}}
						/>
					</Dialog>
				</Modal>
			</DialogTrigger>
		</>
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
