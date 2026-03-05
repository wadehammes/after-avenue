import type { Document } from "@contentful/rich-text-types";
import { unstable_cache } from "next/cache";
import { CONTENTFUL_CACHE_REVALIDATE_SECONDS } from "src/contentful/cacheConfig";
import { contentfulClient } from "src/contentful/client";
import { parseContentfulFeaturedWork, type Work } from "src/contentful/getWork";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import {
  isTypeEditors,
  type TypeEditorsFields,
  type TypeEditorsSkeleton,
  type TypeEditorsWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

type EditorEntry = TypeEditorsWithoutUnresolvableLinksResponse;

export interface EditorType {
  id: string;
  editorBio?: Document | undefined | null;
  editorName: string;
  editorTitle?: string;
  editorSlug: string;
  editorHeadshot?: ContentfulAsset | null;
  editorHeadshotHover?: ContentfulAsset | null;
  featuredWork?: Partial<Work> | null;
  updatedAt: string;
  metaDescription: string;
  priority?: number;
  publishDate: string;
  showOnEditorsPage?: boolean;
  contactFooterButtonText?: string;
  contactFooterTitle?: string;
}

const _editorTypeValidation: ContentfulTypeCheck<
  EditorType,
  TypeEditorsFields,
  "id" | "publishDate" | "updatedAt"
> = true;

export function parseContentfulEditor(
  editorEntry?: EditorEntry,
): EditorType | null {
  if (!editorEntry || !isTypeEditors(editorEntry)) {
    return null;
  }

  return {
    id: editorEntry.sys.id,
    editorBio: editorEntry.fields.editorBio,
    editorHeadshot: parseContentfulAsset(editorEntry.fields.editorHeadshot),
    editorHeadshotHover: parseContentfulAsset(
      editorEntry.fields.editorHeadshotHover,
    ),
    editorName: editorEntry.fields.editorName,
    editorSlug: editorEntry.fields.editorSlug,
    editorTitle: editorEntry.fields.editorTitle,
    featuredWork: parseContentfulFeaturedWork(editorEntry.fields.featuredWork),
    updatedAt: editorEntry.sys.updatedAt,
    metaDescription: editorEntry.fields.metaDescription,
    priority: editorEntry.fields.priority ? 1 : 0,
    publishDate: editorEntry.sys.createdAt,
    showOnEditorsPage: editorEntry.fields.showOnEditorsPage ?? false,
  };
}

interface FetchAllWorkOptions {
  preview: boolean;
}

export async function fetchAllEditorsUncached({
  preview,
}: FetchAllWorkOptions): Promise<EditorType[]> {
  const contentful = contentfulClient({ preview });

  const editorResults =
    await contentful.withoutUnresolvableLinks.getEntries<TypeEditorsSkeleton>({
      content_type: "editors",
      include: 10,
      limit: 1000,
      order: ["fields.priority"],
    });

  return editorResults.items
    .map((pageEntry) => parseContentfulEditor(pageEntry))
    .filter((editor): editor is EditorType => editor !== null);
}

export async function fetchAllEditors({
  preview,
}: FetchAllWorkOptions): Promise<EditorType[]> {
  return unstable_cache(
    () => fetchAllEditorsUncached({ preview }),
    ["contentful", "editors", "all", String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}

interface FetchEditorBySlugOptions {
  slug: string;
  preview: boolean;
}

export async function fetchEditorBySlugUncached({
  slug,
  preview,
}: FetchEditorBySlugOptions): Promise<EditorType | null> {
  const contentful = contentfulClient({ preview });

  const pagesResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeEditorsSkeleton>({
      content_type: "editors",
      "fields.editorSlug": slug,
      include: 10,
    });

  return parseContentfulEditor(pagesResult.items[0]);
}

export async function fetchEditorBySlug({
  slug,
  preview,
}: FetchEditorBySlugOptions): Promise<EditorType | null> {
  return unstable_cache(
    () => fetchEditorBySlugUncached({ slug, preview }),
    ["contentful", "editor", slug, String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}

export async function fetchAllEditorsForMainPageUncached({
  preview,
}: FetchAllWorkOptions): Promise<EditorType[]> {
  const contentful = contentfulClient({ preview });

  const editorResults =
    await contentful.withoutUnresolvableLinks.getEntries<TypeEditorsSkeleton>({
      content_type: "editors",
      "fields.showOnEditorsPage": true,
      include: 10,
      limit: 1000,
      order: ["fields.priority"],
    });

  return editorResults.items
    .map((pageEntry) => parseContentfulEditor(pageEntry))
    .filter((editor): editor is EditorType => editor !== null);
}

export async function fetchAllEditorsForMainPage({
  preview,
}: FetchAllWorkOptions): Promise<EditorType[]> {
  return unstable_cache(
    () => fetchAllEditorsForMainPageUncached({ preview }),
    ["contentful", "editors", "mainPage", String(preview)],
    { revalidate: CONTENTFUL_CACHE_REVALIDATE_SECONDS },
  )();
}

export const parseContentfulEditorForCta = (
  editorEntry?: EditorEntry,
): Partial<EditorType> | null => {
  if (!editorEntry || !isTypeEditors(editorEntry)) {
    return null;
  }

  return {
    editorName: editorEntry.fields.editorName,
    editorSlug: editorEntry.fields.editorSlug,
  };
};
