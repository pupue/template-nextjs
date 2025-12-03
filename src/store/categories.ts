import { atom } from "jotai";
import type { CategoryType, SelectCategory } from "@/db/schema";

// カテゴリ一覧を管理するatom
export const categoriesAtom = atom<SelectCategory[]>([]);

// 収支タイプを管理するatom
export const typeAtom = atom<CategoryType>("expense");

// 選択された収支タイプに応じてフィルタリングされたカテゴリを返すderived atom
export const filteredCategoriesAtom = atom((get) => {
	const type = get(typeAtom);
	return get(categoriesAtom).filter((c) => c.type === type);
});
