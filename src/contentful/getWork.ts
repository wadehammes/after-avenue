import type { Document } from "@contentful/rich-text-types";
import { unstable_cache } from "next/cache";
import { CONTENTFUL_CACHE_REVALIDATE_SECONDS } from "src/contentful/cacheConfig";
import { contentfulClient } from "src/contentful/client";
import {
  type EditorType,
  parseContentfulEditor,
} from "src/contentful/getEditors";
import type { WorkCategory } from "src/contentful/getWorkCategories";
import { parseContentfulWorkCategory } from "src/contentful/getWorkCategories";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  isTypeWork,
  type TypeWorkFields,
  type TypeWorkSkeleton,
  type TypeWorkWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

type WorkEntry = TypeWorkWithoutUnresolvableLinksResponse;

export interface Work {
  contactFooterButtonText?: string;
  contactFooterTitle?: string;
  featuredOnHomePage?: boolean;
  featuredHomePriority?: number;
  hideFromWorkFeeds?: boolean;
  publishDate: string;
  id: string;
  updatedAt: string;
  workCategories?: (WorkCategory | null)[];
  workClient?: string;
  workCredits?: Document | undefined | null;
  workDate?: string | null;
  workDescription?: Document | undefined | null;
  workEditors?: (EditorType | null)[];
  workSeriesCategory?: WorkCategory | null;
  workSlug: string;
  workTitle: string;
  workVideoUrl: string;
}

const _workTypeValidation: ContentfulTypeCheck<
  Work,
  TypeWorkFields,
  "id" | "publishDate" | "updatedAt"
> = true;

export function parseContentfulWork(workEntry?: WorkEntry): Work | null {
  if (!workEntry || !isTypeWork(workEntry)) {
    return null;
  }

  return {
    contactFooterButtonText: workEntry.fields.contactFooterButtonText,
    contactFooterTitle: workEntry.fields.contactFooterTitle,
    id: workEntry.sys.id,
    featuredOnHomePage: workEntry.fields?.featuredOnHomePage ?? false,
    featuredHomePriority: workEntry.fields?.featuredHomePriority ?? 0,
    hideFromWorkFeeds: workEntry.fields?.hideFromWorkFeeds ?? false,
    updatedAt: workEntry.sys.updatedAt,
    workCategories:
      workEntry?.fields?.workCategories?.map((category) =>
        category ? parseContentfulWorkCategory(category) : null,
      ) ?? [],
    workClient: workEntry.fields?.workClient ?? "",
    workCredits: workEntry.fields.workCredits,
    workDate: workEntry.fields.workDate ?? null,
    workDescription: workEntry.fields.workDescription,
    workEditors: workEntry.fields?.workEditors?.map((editor) =>
      editor ? parseContentfulEditor(editor) : null,
    ),
    workSeriesCategory: workEntry.fields?.workSeriesCategory
      ? parseContentfulWorkCategory(workEntry.fields.workSeriesCategory)
      : null,
    workSlug: workEntry.fields.workSlug,
    workTitle: workEntry.fields.workTitle,
    workVideoUrl: workEntry.fields?.workVideoUrl ?? "",
    publishDate: workEntry.sys.createdAt,
  };
}

export function parseContentfulFeaturedWork(
  workEntry?: WorkEntry,
): Partial<Work> | null {
  if (!workEntry || !isTypeWork(workEntry)) {
    return null;
  }

  return {
    id: workEntry.sys.id,
    workVideoUrl: workEntry.fields?.workVideoUrl ?? "",
  };
}

interface FetchAllWorkOptions {
  preview: boolean;
}

export async function fetchAllWorkUncached({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });
  const limit = 10;
  let total = 0;
  let skip = 0;
  const allWork: Work[] = [];
  const seenIds = new Set<string>();

  do {
    const workResult =
      await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
        content_type: "work",
        include: 10,
        limit,
        skip,
        "fields.hideFromWorkFeeds": false,
        order: ["-fields.featuredOnHomePage", "-fields.workDate"],
      });

    total = workResult.total;

    const filteredWork = workResult.items
      .map((pageEntry) => parseContentfulWork(pageEntry))
      .filter((work): work is Work => {
        if (!work || seenIds.has(work.id)) {
          return false;
        }
        seenIds.add(work.id);
        return true;
      });

    allWork.push(...filteredWork);
    skip += limit;
  } while (skip < total);

  return allWork;
}

export async function fetchAllWork({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  return unstable_cache(
    () => fetchAllWorkUncached({ preview }),
    ["contentful", "work", "all", String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}

interface FetchWorkByCategoryOptions {
  category: string;
  preview: boolean;
}

export async function fetchWorkByCategoryUncached({
  preview,
  category,
}: FetchWorkByCategoryOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      content_type: "work",
      include: 10,
      limit: 1000,
      "fields.workSeriesCategory.sys.contentType.sys.id": "workCategory",
      "fields.workSeriesCategory.fields.categoryName": category,
    });

  const seenIds = new Set<string>();

  return workResult.items
    .map((pageEntry) => parseContentfulWork(pageEntry))
    .filter((work): work is Work => {
      if (!work || seenIds.has(work.id)) {
        return false;
      }
      seenIds.add(work.id);
      return true;
    });
}

export async function fetchWorkByCategory({
  preview,
  category,
}: FetchWorkByCategoryOptions): Promise<Work[]> {
  if (!category) {
    return [];
  }

  return unstable_cache(
    () => fetchWorkByCategoryUncached({ preview, category }),
    ["contentful", "work", "category", category, String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}

interface FetchWorkByEditorOptions {
  editorSlug: string;
  preview: boolean;
}

export async function fetchWorkByEditorUncached({
  preview,
  editorSlug,
}: FetchWorkByEditorOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      content_type: "work",
      include: 10,
      limit: 1000,
      order: ["-fields.workDate"],
    });

  const seenIds = new Set<string>();

  const parseWorkResults = workResult.items
    .map((pageEntry) => parseContentfulWork(pageEntry))
    .filter((work): work is Work => {
      if (!work || seenIds.has(work.id)) {
        return false;
      }
      seenIds.add(work.id);
      return true;
    });

  return parseWorkResults.filter((work) => {
    if (!work || !work.workEditors) {
      return false;
    }

    return work.workEditors.some((editor) => {
      return editor ? editor.editorSlug === editorSlug : false;
    });
  });
}

export async function fetchWorkByEditor({
  preview,
  editorSlug,
}: FetchWorkByEditorOptions): Promise<Work[]> {
  if (!editorSlug) {
    return [];
  }

  return unstable_cache(
    () => fetchWorkByEditorUncached({ preview, editorSlug }),
    ["contentful", "work", "editor", editorSlug, String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}

export async function fetchAllFeaturedWorkUncached({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      content_type: "work",
      include: 10,
      "fields.featuredOnHomePage": true,
      limit: 8,
      order: ["fields.featuredHomePriority"],
    });

  const seenIds = new Set<string>();

  return workResult.items
    .map((pageEntry) => parseContentfulWork(pageEntry))
    .filter((work): work is Work => {
      if (!work || seenIds.has(work.id)) {
        return false;
      }
      seenIds.add(work.id);
      return true;
    });
}

export async function fetchAllFeaturedWork({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  return unstable_cache(
    () => fetchAllFeaturedWorkUncached({ preview }),
    ["contentful", "work", "featured", String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}

export async function fetchRandomWorkUncached({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });

  const allWork =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      content_type: "work",
      include: 10,
      limit: 200,
      "fields.hideFromWorkFeeds": false,
    });

  const seenIds = new Set<string>();

  const uniqueWork = allWork.items
    .map((work) => parseContentfulWork(work))
    .filter((work): work is Work => {
      if (!work || seenIds.has(work.id)) {
        return false;
      }
      seenIds.add(work.id);
      return true;
    });

  const shuffledWork = uniqueWork.sort(() => Math.random() - 0.5);

  return shuffledWork.slice(0, 4);
}

export async function fetchRandomWork({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  return unstable_cache(
    () => fetchRandomWorkUncached({ preview }),
    ["contentful", "work", "random", String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}

interface FetchSingleWorkOptions {
  slug: string;
  preview: boolean;
}

export async function fetchWorkBySlugUncached({
  slug,
  preview,
}: FetchSingleWorkOptions): Promise<Work | null> {
  const contentful = contentfulClient({ preview });

  const pagesResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      content_type: "work",
      "fields.workSlug": slug,
      include: 10,
    });

  return parseContentfulWork(pagesResult.items[0]);
}

export async function fetchWorkBySlug({
  slug,
  preview,
}: FetchSingleWorkOptions): Promise<Work | null> {
  return unstable_cache(
    () => fetchWorkBySlugUncached({ slug, preview }),
    ["contentful", "work", "slug", slug, String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}
