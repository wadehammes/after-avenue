import type { Entry } from "contentful";
import {
  type Page,
  parseContentfulPageForNavigation,
} from "src/contentful/getPages";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { TypeComponentSlideSkeleton } from "src/contentful/types";

export type SlideType = "Conversation Bubble" | "Hero" | "Regular";

// Our simplified version of an slide entry.
// We don't need all the data that Contentful gives us.
export interface ComponentSlide {
  backgroundMedia?: ContentfulAsset | null;
  ctaText?: string;
  headline?: string;
  id: string;
  pageCta?: Partial<Page> | null;
  pageHash?: string;
  slideCopy?: string;
  slug?: string;
  subheadline?: string;
  slideType?: SlideType;
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
    backgroundMedia: parseContentfulAsset(entry.fields.backgroundMedia),
    ctaText: entry.fields.ctaText,
    headline: entry.fields.headline,
    id: entry.sys.id,
    pageCta: parseContentfulPageForNavigation(entry.fields.pageCta),
    pageHash: entry.fields.pageHash,
    slideCopy: entry.fields.slideCopy,
    slug: entry.fields.slug,
    subheadline: entry.fields.subheadline,
    slideType: entry.fields.slideType as SlideType,
  };
}
