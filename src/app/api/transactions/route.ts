import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";

export async function GET(_request: Request) {
	try {
		const result = await db.select().from(transactionsTable);
		return NextResponse.json(result);
	} catch (error) {
		console.error("取引取得エラー:", error);
		return NextResponse.json(
			{ error: "取引の取得に失敗しました" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { type, amount, date, memo, categoryId } = body;

		// バリデーション
		if (!type || (type !== "income" && type !== "expense")) {
			return NextResponse.json(
				{ error: "タイプは 'income' または 'expense' である必要があります" },
				{ status: 400 },
			);
		}

		if (typeof amount !== "number" || amount <= 0) {
			return NextResponse.json(
				{ error: "金額は正の数である必要があります" },
				{ status: 400 },
			);
		}

		if (!date || typeof date !== "string") {
			return NextResponse.json({ error: "日付は必須です" }, { status: 400 });
		}

		const result = await db
			.insert(transactionsTable)
			.values({
				type,
				amount: Math.floor(amount), // 整数に変換
				date: date.trim(),
				memo: memo ? memo.trim() : null,
				categoryId: categoryId ? parseInt(categoryId) : null,
			})
			.returning();

		return NextResponse.json(result[0], { status: 201 });
	} catch (error) {
		console.error("取引追加エラー:", error);
		return NextResponse.json(
			{ error: "取引の追加に失敗しました" },
			{ status: 500 },
		);
	}
}
