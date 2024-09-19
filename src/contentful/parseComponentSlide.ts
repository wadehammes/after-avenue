import type { Entry } from "contentful";
import {
  Page,
  parseContentfulPageForNavigation,
} from "src/contentful/getPages";
import {
  ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import { TypeComponentSlideSkeleton } from "src/contentful/types";

// Our simplified version of an slide entry.
// We don't need all the data that Contentful gives us.
export interface ComponentSlide {
  id: string;
  backgroundMedia?: ContentfulAsset | null;
  headline?: string;
  slideCopy?: string;
  slug?: string;
  subheadline?: string;
  pageCta?: Partial<Page> | null;
  pageHash?: string;
}

export type ComponentSlideEntry =
  | Entry<TypeComponentSlideSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

// A function to transform a Contentful slide component
export function parseContentfulComponentSlide(
  entry: ComponentSlideEntry,
): ComponentSlide | null {
  if (!entry) {
    return null;
  }

  return {
    id: entry.sys.id,
    backgroundMedia: parseContentfulAsset(entry.fields.backgroundMedia),
    headline: entry.fields.headline,
    slideCopy: entry.fields.slideCopy,
    subheadline: entry.fields.subheadline,
    slug: entry.fields.slug,
    pageCta: parseContentfulPageForNavigation(entry.fields.pageCta),
    pageHash: entry.fields.pageHash,
  };
}
