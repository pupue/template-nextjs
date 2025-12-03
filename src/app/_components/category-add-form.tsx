"use client";

import { useState } from "react";
import {
	Button,
	FieldError,
	Form,
	Input,
	TextField,
} from "react-aria-components";
import { createCategory } from "@/actions/category";
import InputLabel from "@/components/ui/input-label";
import { useCategory } from "../_hooks/use-category";

type Props = {
	onClose: () => void;
	onCategoryAdded: (id: string) => void;
};

export default function CategoryAddForm({ onClose, onCategoryAdded }: Props) {
	const { type, setCategories } = useCategory();
	const [name, setName] = useState("");

	async function handleSubmit() {
		const result = await createCategory({ name, type });
		setCategories((prev) => [result, ...prev]);
		onCategoryAdded(result.id.toString());
	}

	return (
		<Form>
			<div className="space-y-4">
				<InputLabel>新規カテゴリ</InputLabel>
				<TextField
					value={name}
					onChange={setName}
					isRequired
					autoFocus
					aria-label="カテゴリ名を入力"
				>
					<Input
						placeholder="カテゴリ名を入力"
						className="w-full border border-input rounded-md p-2"
					/>
					<FieldError />
				</TextField>
				<div className="flex gap-2 justify-end">
					<Button
						onPress={onClose}
						className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
					>
						キャンセル
					</Button>
					<Button
						onPress={handleSubmit}
						isDisabled={!name.trim()}
						className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						追加
					</Button>
				</div>
			</div>
		</Form>
	);
}
