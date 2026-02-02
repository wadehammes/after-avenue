import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import {
  parseContentfulSection,
  type SectionType,
} from "src/contentful/parseSections";
import type {
  TypePageFields,
  TypePageSkeleton,
} from "src/contentful/types/TypePage";

export type PageEntry = Entry<
  TypePageSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

export interface Page {
  id: string;
  contactFooterTitle?: string;
  contactFooterButtonText?: string;
  enableIndexing: boolean;
  metaDescription: string;
  metaKeywords: string[];
  pageDescription?: string;
  pageDisplayTitle?: string;
  pageSlug: string;
  pageSubtitle?: string;
  pageTitle: string;
  sections: (SectionType | null)[];
  socialImage: ContentfulAsset | null;
  updatedAt: string;
  publishDate: string;
}

const _pageTypeValidation: ContentfulTypeCheck<
  Page,
  TypePageFields,
  "id" | "publishDate" | "updatedAt"
> = true;

export function parseContentfulPage(pageEntry?: PageEntry): Page | null {
  if (!pageEntry) {
    return null;
  }

  if (!("fields" in pageEntry)) {
    return null;
  }

  return {
    id: pageEntry.sys.id,
    contactFooterButtonText: pageEntry.fields.contactFooterButtonText,
    contactFooterTitle: pageEntry.fields.contactFooterTitle,
    enableIndexing: pageEntry.fields?.enableIndexing ?? true,
    metaDescription: pageEntry.fields.metaDescription,
    metaKeywords: pageEntry.fields.metaKeywords ?? [],
    pageDescription: pageEntry.fields.pageDescription,
    pageSlug: pageEntry.fields.pageSlug,
    pageDisplayTitle: pageEntry.fields.pageDisplayTitle,
    pageTitle: pageEntry.fields.pageTitle,
    pageSubtitle: pageEntry.fields.pageSubtitle,
    sections:
      pageEntry?.fields?.sections?.map((section) =>
        parseContentfulSection(section),
      ) ?? [],
    socialImage: parseContentfulAsset(pageEntry.fields.socialImage),
    updatedAt: pageEntry.sys.updatedAt,
    publishDate: pageEntry.sys.createdAt,
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
      content_type: "page",
      include: 10,
      limit: 1000,
    });

  const seenSlugs = new Set<string>();

  return pageResult.items
    .map((pageEntry) => parseContentfulPage(pageEntry) as Page)
    .filter((page) => {
      if (!page || seenSlugs.has(page.pageSlug)) {
        return false;
      }
      seenSlugs.add(page.pageSlug);
      return true;
    });
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
      content_type: "page",
      "fields.pageSlug": slug,
      include: 10,
    });

  return parseContentfulPage(pagesResult.items[0]);
}
