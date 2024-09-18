import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import { Editor, parseContentfulEditor } from "src/contentful/getEditors";
import type { WorkCategory } from "src/contentful/getWorkCategories";
import { parseContentfulWorkCategory } from "src/contentful/getWorkCategories";
import type { TypeWorkSkeleton } from "src/contentful/types";

type WorkEntry = Entry<TypeWorkSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>;

// Our simplified version of a Page.
// We don't need all the data that Contentful gives us.
export interface Work {
  contactFooterButtonText?: string;
  contactFooterTitle?: string;
  featuredOnHomePage: boolean;
  hideFromWorkFeeds: boolean;
  id: string;
  updatedAt: string;
  workCategories: (WorkCategory | null)[];
  workClient: string;
  workCredits: Document | undefined | null;
  workDescription: Document | undefined | null;
  workDirector: string;
  workEditors?: (Editor | null)[];
  workSeriesCategory: WorkCategory | null;
  workSlug: string;
  workTitle: string;
  workVideoUrl: string;
}

// A function to transform a Contentful page
// into our own Page object.
export function parseContentfulWork(workEntry?: WorkEntry): Work | null {
  if (!workEntry) {
    return null;
  }

  return {
    contactFooterButtonText: workEntry.fields.contactFooterButtonText,
    contactFooterTitle: workEntry.fields.contactFooterTitle,
    id: workEntry.sys.id,
    featuredOnHomePage: workEntry.fields?.featuredOnHomePage ?? false,
    hideFromWorkFeeds: workEntry.fields?.hideFromWorkFeeds ?? false,
    updatedAt: workEntry.sys.updatedAt,
    workCategories:
      workEntry?.fields?.workCategories?.map((category) =>
        category ? parseContentfulWorkCategory(category) : null,
      ) ?? [],
    workClient: workEntry.fields?.workClient ?? "",
    workCredits: workEntry.fields.workCredits,
    workDescription: workEntry.fields.workDescription,
    workDirector: workEntry.fields?.workDirector ?? "",
    workEditors: workEntry.fields?.workEditors?.map((editor) =>
      editor ? parseContentfulEditor(editor) : null,
    ),
    workSeriesCategory: workEntry.fields?.workSeriesCategory
      ? parseContentfulWorkCategory(workEntry.fields.workSeriesCategory)
      : null,
    workSlug: workEntry.fields.workSlug,
    workTitle: workEntry.fields.workTitle,
    workVideoUrl: workEntry.fields?.workVideoUrl ?? "",
  };
}

export function parseContentfulFeaturedWork(
  workEntry?: WorkEntry,
): Partial<Work> | null {
  if (!workEntry) {
    return null;
  }

  return {
    id: workEntry.sys.id,
    workVideoUrl: workEntry.fields?.workVideoUrl ?? "",
  };
}

// A function to fetch all pages.
// Optionally uses the Contentful content preview.
interface FetchAllWorkOptions {
  preview: boolean;
}

export async function fetchAllWork({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "work",
      include: 10,
      limit: 1000,
    });

  return workResult.items.map(
    (pageEntry) => parseContentfulWork(pageEntry) as Work,
  );
}

interface FetchWorkByCategoryOptions {
  category: string;
  preview: boolean;
}

export async function fetchWorkByCategory({
  preview,
  category,
}: FetchWorkByCategoryOptions): Promise<Work[]> {
  if (!category) {
    return [];
  }

  const contentful = contentfulClient({ preview });

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "work",
      include: 10,
      limit: 1000,
      "fields.workSeriesCategory.sys.contentType.sys.id": "workCategory",
      "fields.workSeriesCategory.fields.categoryName": category,
    });

  return workResult.items.map(
    (pageEntry) => parseContentfulWork(pageEntry) as Work,
  );
}

interface FetchWorkByEditorOptions {
  editorSlug: string;
  preview: boolean;
}

export async function fetchWorkByEditor({
  preview,
  editorSlug,
}: FetchWorkByEditorOptions): Promise<Work[]> {
  if (!editorSlug) {
    return [];
  }

  const contentful = contentfulClient({ preview });

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "work",
      include: 10,
      limit: 1000,
    });

  const parseWorkResults = workResult.items.map(
    (pageEntry) => parseContentfulWork(pageEntry) as Work,
  );

  return parseWorkResults.filter((work) => {
    if (!work || !work.workEditors) {
      return false;
    }

    return work.workEditors.some((editor) => {
      return editor ? editor.editorSlug === editorSlug : false;
    });
  });
}

export async function fetchAllFeaturedWork({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "work",
      include: 10,
      "fields.featuredOnHomePage": true,
      limit: 5,
    });

  return workResult.items.map(
    (pageEntry) => parseContentfulWork(pageEntry) as Work,
  );
}

export async function fetchRecentWork({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "work",
      include: 10,
      limit: 3,
    });

  return workResult.items.map(
    (pageEntry) => parseContentfulWork(pageEntry) as Work,
  );
}

export async function fetchRandomWork({
  preview,
}: FetchAllWorkOptions): Promise<Work[]> {
  const contentful = contentfulClient({ preview });

  const workResults =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "work",
      limit: 0,
    });

  const workCount = workResults.total;

  const workResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "work",
      include: 10,
      limit: 3,
      skip: Math.floor(Math.random() * (workCount - 3)),
    });

  return workResult.items.map(
    (pageEntry) => parseContentfulWork(pageEntry) as Work,
  );
}

// A function to fetch a single page by its slug.
// Optionally uses the Contentful content preview.
interface FetchSingleWorkOptions {
  slug: string;
  preview: boolean;
}

export async function fetchWorkBySlug({
  slug,
  preview,
}: FetchSingleWorkOptions): Promise<Work | null> {
  const contentful = contentfulClient({ preview });

  const pagesResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeWorkSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "work",
      "fields.workSlug": slug,
      include: 10,
    });

  return parseContentfulWork(pagesResult.items[0]);
}
