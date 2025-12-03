import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function GET() {
	try {
		const result = await db.select().from(categories);
		return NextResponse.json(result);
	} catch (error) {
		console.error("カテゴリ取得エラー:", error);
		return NextResponse.json(
			{ error: "カテゴリの取得に失敗しました" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name } = body;

		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return NextResponse.json(
				{ error: "カテゴリ名は必須です" },
				{ status: 400 },
			);
		}

		const result = await db
			.insert(categories)
			.values({ name: name.trim() })
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
