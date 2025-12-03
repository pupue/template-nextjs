"use server";

import { db } from "@/db";
import { type CategoryType, categories } from "@/db/schema";

export async function getAllCategories() {
	try {
		const result = await db.select().from(categories);
		return result;
	} catch (error) {
		console.error("カテゴリ取得エラー:", error);
		throw new Error("カテゴリの取得に失敗しました");
	}
}

export async function createCategory(input: {
	name: string;
	type: CategoryType;
}) {
	const { name, type } = input;

	if (!name || typeof name !== "string" || name.trim().length === 0) {
		throw new Error("カテゴリ名は必須です");
	}
	if (type !== "income" && type !== "expense") {
		throw new Error("タイプは 'income' または 'expense' である必要があります");
	}

	try {
		const result = await db
			.insert(categories)
			.values({ name: name.trim(), type })
			.returning();

		return result[0];
	} catch (error) {
		console.error("カテゴリ追加エラー:", error);
		throw new Error("カテゴリの追加に失敗しました");
	}
}
