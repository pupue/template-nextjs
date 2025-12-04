function _formatWithComma(digits: string) {
	if (!digits) return "";
	return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function _parseToNumber(text: string): number | null {
	const digits = text.replace(/[^\d]/g, ""); // カンマ等を除去（整数想定）
	if (!digits) return null;
	return Number(digits);
}
