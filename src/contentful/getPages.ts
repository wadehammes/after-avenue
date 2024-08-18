import { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import { ContentfulAsset, parseContentfulAsset } from "src/contentful/image";
import { TypePageSkeleton } from "src/contentful/types/TypePage";

type PageEntry = Entry<TypePageSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>;

// Our simplified version of a Page.
// We don't need all the data that Contentful gives us.
export interface Page {
  pageTitle: string;
  pageSlug: string;
  enableIndexing: boolean;
  pageDescription: string;
  socialImage: ContentfulAsset | null;
  updatedAt: string;
}

// A function to transform a Contentful page
// into our own Page object.
export function parseContentfulPage(pageEntry?: PageEntry): Page | null {
  if (!pageEntry) {
    return null;
  }

  return {
    pageTitle: pageEntry.fields.pageTitle,
    pageSlug: pageEntry.fields.pageSlug,
    enableIndexing: pageEntry.fields?.enableIndexing ?? true,
    updatedAt: pageEntry.sys.updatedAt,
    pageDescription: pageEntry.fields.pageDescription,
    socialImage: parseContentfulAsset(pageEntry.fields.socialImage),
  };
}

// A function to transform a Contentful page for navigation
export function parseContentfulPageForNavigation(
  pageEntry?: PageEntry,
): Partial<Page | null> {
  if (!pageEntry) {
    return null;
  }

  return {
    pageSlug: pageEntry.fields.pageSlug,
    pageTitle: pageEntry.fields.pageTitle,
  };
}

// A function to fetch all pages.
// Optionally uses the Contentful content preview.
interface FetchPagesOptions {
  preview: boolean;
}

export async function fetchPages({
  preview,
}: FetchPagesOptions): Promise<Page[]> {
  const contentful = contentfulClient({ preview });

  const pageResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypePageSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "page",
      include: 10,
      limit: 1000,
    });

  return pageResult.items.map(
    (pageEntry) => parseContentfulPage(pageEntry) as Page,
  );
}

// A function to fetch a single page by its slug.
// Optionally uses the Contentful content preview.
interface FetchPageOptions {
  slug: string;
  preview: boolean;
}

export async function fetchPage({
  slug,
  preview,
}: FetchPageOptions): Promise<Page | null> {
  const contentful = contentfulClient({ preview });

  const pagesResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypePageSkeleton>({
      // biome-ignore lint/style/useNamingConvention: Contentful standards
      content_type: "page",
      "fields.pageSlug": slug,
      include: 10,
    });

  return parseContentfulPage(pagesResult.items[0]);
}
