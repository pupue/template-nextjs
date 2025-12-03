import { useAtom, useAtomValue } from "jotai";
import {
	categoriesAtom,
	filteredCategoriesAtom,
	typeAtom,
} from "@/store/categories";

export function useCategory() {
	const [categories, setCategories] = useAtom(categoriesAtom);
	const filteredCategories = useAtomValue(filteredCategoriesAtom);

	const [type, setType] = useAtom(typeAtom);

	return { categories, setCategories, filteredCategories, type, setType };
}
