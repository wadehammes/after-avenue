import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import type { TypeEditorsSkeleton } from "src/contentful/types";

type EditorEntry = Entry<
  TypeEditorsSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

// Our simplified version of a Page.
// We don't need all the data that Contentful gives us.
export interface Editor {
  editorBio: Document | undefined | null;
  editorName: string;
  editorSlug: string;
  editorHeadshot: ContentfulAsset | null;
  updatedAt: string;
}

// A function to transform a Contentful page
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
    editorName: editorEntry.fields.editorName,
    editorSlug: editorEntry.fields.editorSlug,
    updatedAt: editorEntry.sys.updatedAt,
  };
}

// A function to fetch all pages.
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
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "editors",
      include: 10,
      limit: 1000,
    });

  return editorResults.items.map(
    (pageEntry) => parseContentfulEditor(pageEntry) as Editor,
  );
}

// A function to fetch a single page by its slug.
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
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "editors",
      "fields.editorSlug": slug,
      include: 10,
    });

  return parseContentfulEditor(pagesResult.items[0]);
}
