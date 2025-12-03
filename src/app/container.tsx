export default function Container({ children }: { children: React.ReactNode }) {
	return <div className="max-w-sm mx-auto px-5 h-full">{children}</div>;
}
