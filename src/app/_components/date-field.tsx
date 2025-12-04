"use client";

import type { CalendarDate } from "@internationalized/date";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
	Button,
	Calendar,
	CalendarCell,
	CalendarGrid,
	DatePicker,
	Dialog,
	Group,
	Popover,
} from "react-aria-components";
import InputLabel from "@/components/ui/input-label";
import { cn } from "@/utils/cn";

function toYMD(d: CalendarDate | null) {
	return d
		? `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(
				2,
				"0",
			)}`
		: "";
}

export default function DateField() {
	const [value, setValue] = useState<string>("");
	const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);

	const displayDate = selectedDate
		? `${selectedDate.year}/${String(selectedDate.month).padStart(
				2,
				"0",
			)}/${String(selectedDate.day).padStart(2, "0")}`
		: format(new Date(), "yyyy/MM/dd");

	const handleChange = (d: CalendarDate | null) => {
		setSelectedDate(d);
		setValue(toYMD(d));
	};

	return (
		<>
			<input type="hidden" name="date" value={value} />

			<InputLabel id="date-label">日付</InputLabel>
			<DatePicker lang="ja" value={selectedDate} onChange={handleChange}>
				<Group>
					<Button className="w-full border border-input rounded-md flex items-center justify-between gap-2 p-4">
						{displayDate}
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
		</>
	);
}
