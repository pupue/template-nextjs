"use client";

import {
	type Selection,
	ToggleButton,
	ToggleButtonGroup,
	type ToggleButtonProps,
} from "react-aria-components";
import InputLabel from "@/components/ui/input-label";
import { cn } from "@/utils/cn";
import { useCategory } from "../_hooks/use-category";

export default function TypeField() {
	const { type, setType } = useCategory();

	function handleTypeChange(keys: Selection) {
		const typeKeys = Array.from(keys);
		const type = typeKeys[0] === "income" ? "income" : "expense";
		setType(type);
	}

	return (
		<div>
			<InputLabel id="type-label">種類</InputLabel>
			<ToggleButtonGroup
				selectedKeys={new Set([type])}
				onSelectionChange={handleTypeChange}
				aria-labelledby="type-label"
			>
				<TypeButton
					id="income"
					className="rounded-l-md data:selected:border-green-dark data-selected:bg-green-dark data-selected:text-white"
				>
					収入
				</TypeButton>
				<TypeButton
					id="expense"
					className="rounded-r-md data:selected:border-red-dark data-selected:bg-red-dark data-selected:text-white"
				>
					支出
				</TypeButton>
			</ToggleButtonGroup>
		</div>
	);
}

function TypeButton({ className, ...props }: ToggleButtonProps) {
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
