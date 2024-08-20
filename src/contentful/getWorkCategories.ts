import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type { TypeWorkCategorySkeleton } from "src/contentful/types";

export interface WorkCategory {
  categoryName: string;
  slug: string;
  updatedAt: string;
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
    slug: category.fields.slug,
    updatedAt: category.sys.updatedAt,
  };
}

// A function to fetch all pages.
// Optionally uses the Contentful content preview.
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
        // biome-ignore lint/style/useNamingConvention: Contentful standards
        content_type: "workCategory",
        include: 10,
        limit: 1000,
      },
    );

  return categoryEntries.items.map(
    (category) => parseContentfulWorkCategory(category) as WorkCategory,
  );
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
        // biome-ignore lint/style/useNamingConvention: Contentful standards
        content_type: "workCategory",
        "fields.slug": slug,
        include: 10,
        limit: 1000,
      },
    );

  return parseContentfulWorkCategory(categoryEntries.items[0]);
}
