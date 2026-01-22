import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import { parseContentfulFeaturedWork, type Work } from "src/contentful/getWork";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import type { TypeEditorsSkeleton } from "src/contentful/types";

type EditorEntry = Entry<
  TypeEditorsSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

// Our simplified version of an Editor.
// We don't need all the data that Contentful gives us.
export interface Editor {
  editorBio: Document | undefined | null;
  editorName: string;
  editorTitle?: string;
  editorSlug: string;
  editorHeadshot: ContentfulAsset | null;
  editorHeadshotHover: ContentfulAsset | null;
  featuredWork: Partial<Work> | null;
  updatedAt: string;
  metaDescription: string;
  priority: number;
  publishDate: string;
}

// A function to transform an editor entry
// into our own Page object.
export function parseContentfulEditor(
  editorEntry?: EditorEntry,
): Editor | null {
  if (!editorEntry) {
    return null;
  }

  return {
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
  };
}

// A function to fetch all editors.
// Optionally uses the Contentful content preview.
interface FetchAllWorkOptions {
  preview: boolean;
}

export async function fetchAllEditors({
  preview,
}: FetchAllWorkOptions): Promise<Editor[]> {
  const contentful = contentfulClient({ preview });

  const editorResults =
    await contentful.withoutUnresolvableLinks.getEntries<TypeEditorsSkeleton>({
      content_type: "editors",
      include: 10,
      limit: 1000,
      order: ["fields.priority"],
    });

  return editorResults.items.map(
    (pageEntry) => parseContentfulEditor(pageEntry) as Editor,
  );
}

// A function to fetch a single editor by its slug.
// Optionally uses the Contentful content preview.
interface FetchEditorBySlugOptions {
  slug: string;
  preview: boolean;
}

export async function fetchEditorBySlug({
  slug,
  preview,
}: FetchEditorBySlugOptions): Promise<Editor | null> {
  const contentful = contentfulClient({ preview });

  const pagesResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeEditorsSkeleton>({
      content_type: "editors",
      "fields.editorSlug": slug,
      include: 10,
    });

  return parseContentfulEditor(pagesResult.items[0]);
}

export const parseContentfulEditorForCta = (
  editorEntry?: EditorEntry,
): Partial<Editor> | null => {
  if (!editorEntry) {
    return null;
  }

  return {
    editorName: editorEntry.fields.editorName,
    editorSlug: editorEntry.fields.editorSlug,
  };
};
