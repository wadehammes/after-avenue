import type { Entry } from "contentful";
import type { TypeWorkCategorySkeleton } from "src/contentful/types";

export interface WorkCategory {
	categoryName: string;
}

type WorkCategoryEntry = Entry<
	TypeWorkCategorySkeleton,
	"WITHOUT_UNRESOLVABLE_LINKS",
	string
>;

export function parseContentfulWorkCategory(
	category: WorkCategoryEntry,
): WorkCategory | null {
	if (!category) {
		return null;
	}

	return {
		categoryName: category.fields.categoryName,
	};
}
