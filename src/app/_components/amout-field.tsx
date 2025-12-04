"use client";

import { useState } from "react";
import { FieldError, Input, TextField } from "react-aria-components";
import InputLabel from "@/components/ui/input-label";

export default function AmountField() {
	const [amount, setAmount] = useState("");

	function handleAmountChange(value: string) {
		const digits = value.replace(/[^\d]/g, "");
		setAmount(digits ? Number(digits).toLocaleString() : "");
	}

	return (
		<div>
			<InputLabel id="amount-label">金額</InputLabel>
			<TextField
				name="amount"
				type="text"
				value={amount}
				onChange={(value) => handleAmountChange(value)}
				className="text-md"
				inputMode="numeric"
			>
				<Input
					placeholder="1,000"
					className="w-full border border-input rounded-md p-4 text-md"
				/>
				<FieldError />
			</TextField>
		</div>
	);
}
