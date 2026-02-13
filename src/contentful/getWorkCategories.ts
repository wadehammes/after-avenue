import { contentfulClient } from "src/contentful/client";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  isTypeWorkCategory,
  type TypeWorkCategoryFields,
  type TypeWorkCategorySkeleton,
  type TypeWorkCategoryWithoutUnresolvableLinksResponse,
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

type WorkCategoryEntry = TypeWorkCategoryWithoutUnresolvableLinksResponse;

export function parseContentfulWorkCategory(
  categoryEntry?: WorkCategoryEntry,
): WorkCategory | null {
  if (!categoryEntry || !isTypeWorkCategory(categoryEntry)) {
    return null;
  }

  return {
    categoryName: categoryEntry.fields.categoryName,
    slug: categoryEntry.fields.slug,
    updatedAt: categoryEntry.sys.updatedAt,
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
    .map((category) => parseContentfulWorkCategory(category))
    .filter((category): category is WorkCategory => {
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
