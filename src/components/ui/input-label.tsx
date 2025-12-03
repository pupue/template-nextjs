import { Label } from "react-aria-components";

export default function InputLabel({
	children,
	id,
}: {
	children: React.ReactNode;
	id?: string;
}) {
	return (
		<Label id={id} className="block text-xs mb-1 text-label">
			{children}
		</Label>
	);
}
