import { Hono } from "hono";
import { handle } from "hono/vercel";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";

const app = new Hono();

app.get("/", async (c) => {
	try {
		const result = await db.select().from(categories);
		console.log(result);
		return c.json(result);
	} catch (error) {
		console.error("カテゴリ取得エラー:", error);
		return c.json({ error: "カテゴリの取得に失敗しました" }, 500);
	}
});

// POST: 既存のNext.jsの方法で実装（変更なし）
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, type } = body;

		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return NextResponse.json(
				{ error: "カテゴリ名は必須です" },
				{ status: 400 },
			);
		}

		if (!type || (type !== "income" && type !== "expense")) {
			return NextResponse.json(
				{ error: "タイプは 'income' または 'expense' である必要があります" },
				{ status: 400 },
			);
		}

		const result = await db
			.insert(categories)
			.values({ name: name.trim(), type })
			.returning();

		return NextResponse.json(result[0], { status: 201 });
	} catch (error) {
		console.error("カテゴリ追加エラー:", error);
		return NextResponse.json(
			{ error: "カテゴリの追加に失敗しました" },
			{ status: 500 },
		);
	}
}

export const GET = handle(app);
