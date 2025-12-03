import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
		}

		const body = await request.json();
		const { type, amount, date, memo, categoryId } = body;

		// 更新するフィールドを構築
		const updateData: {
			type?: "income" | "expense";
			amount?: number;
			date?: string;
			memo?: string | null;
			categoryId?: number | null;
		} = {};

		if (type !== undefined) {
			if (type !== "income" && type !== "expense") {
				return NextResponse.json(
					{ error: "タイプは 'income' または 'expense' である必要があります" },
					{ status: 400 },
				);
			}
			updateData.type = type;
		}

		if (amount !== undefined) {
			if (typeof amount !== "number" || amount <= 0) {
				return NextResponse.json(
					{ error: "金額は正の数である必要があります" },
					{ status: 400 },
				);
			}
			updateData.amount = Math.floor(amount);
		}

		if (date !== undefined) {
			if (typeof date !== "string" || date.trim().length === 0) {
				return NextResponse.json(
					{ error: "日付は有効な文字列である必要があります" },
					{ status: 400 },
				);
			}
			updateData.date = date.trim();
		}

		if (memo !== undefined) {
			updateData.memo = memo ? memo.trim() : null;
		}

		if (categoryId !== undefined) {
			updateData.categoryId = categoryId ? parseInt(categoryId) : null;
		}

		// 更新対象が存在するか確認
		const existing = await db
			.select()
			.from(transactionsTable)
			.where(eq(transactionsTable.id, id));

		if (existing.length === 0) {
			return NextResponse.json(
				{ error: "取引が見つかりません" },
				{ status: 404 },
			);
		}

		const result = await db
			.update(transactionsTable)
			.set(updateData)
			.where(eq(transactionsTable.id, id))
			.returning();

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error("取引更新エラー:", error);
		return NextResponse.json(
			{ error: "取引の更新に失敗しました" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const id = Number(params.id);

		if (Number.isNaN(id)) {
			return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
		}

		// 削除対象が存在するか確認
		const existing = await db
			.select()
			.from(transactionsTable)
			.where(eq(transactionsTable.id, id));

		if (existing.length === 0) {
			return NextResponse.json(
				{ error: "取引が見つかりません" },
				{ status: 404 },
			);
		}

		await db.delete(transactionsTable).where(eq(transactionsTable.id, id));

		return NextResponse.json(
			{ message: "取引が削除されました" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("取引削除エラー:", error);
		return NextResponse.json(
			{ error: "取引の削除に失敗しました" },
			{ status: 500 },
		);
	}
}
