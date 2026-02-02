import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import type {
  TypeWorkCategoryFields,
  TypeWorkCategorySkeleton,
} from "src/contentful/types";

export interface WorkCategory {
  categoryName: string;
  slug: string;
  updatedAt: string;
}

const _workCategoryTypeValidation: ContentfulTypeCheck<
  WorkCategory,
  TypeWorkCategoryFields,
  "updatedAt"
> = true;

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

  if (!("fields" in category)) {
    return null;
  }

  return {
    categoryName: category.fields.categoryName,
    slug: category.fields.slug,
    updatedAt: category.sys.updatedAt,
  };
}

interface FetchAllWorkOptions {
  preview: boolean;
}

export async function fetchAllWorkCategories({
  preview,
}: FetchAllWorkOptions): Promise<WorkCategory[]> {
  const contentful = contentfulClient({ preview });

  const categoryEntries =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkCategorySkeleton>(
      {
        content_type: "workCategory",
        include: 10,
        limit: 1000,
      },
    );

  const seenSlugs = new Set<string>();

  return categoryEntries.items
    .map((category) => parseContentfulWorkCategory(category) as WorkCategory)
    .filter((category) => {
      if (!category || seenSlugs.has(category.slug)) {
        return false;
      }
      seenSlugs.add(category.slug);
      return true;
    });
}

interface FetchCategoryBySlugProps {
  preview: boolean;
  slug: string;
}

export async function fetchWorkCategoryBySlug({
  preview,
  slug,
}: FetchCategoryBySlugProps): Promise<WorkCategory | null> {
  const contentful = contentfulClient({ preview });

  const categoryEntries =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkCategorySkeleton>(
      {
        content_type: "workCategory",
        "fields.slug": slug,
        include: 10,
        limit: 1000,
      },
    );

  return parseContentfulWorkCategory(categoryEntries.items[0]);
}
