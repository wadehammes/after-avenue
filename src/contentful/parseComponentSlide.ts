import type { Entry } from "contentful";
import {
  type Page,
  parseContentfulPageForNavigation,
} from "src/contentful/getPages";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type {
  TypeComponentSlideFields,
  TypeComponentSlideSkeleton,
} from "src/contentful/types";

export type SlideType = ExtractSymbolType<
  NonNullable<TypeComponentSlideFields["slideType"]>
>;

export interface ComponentSlide {
  backgroundMedia?: ContentfulAsset | null;
  ctaText?: string;
  headline?: string;
  id: string;
  pageCta?: Partial<Page> | null;
  pageHash?: string;
  slideCopy?: string;
  slug: string;
  subheadline?: string;
  slideType?: SlideType;
}

const _componentSlideTypeValidation: ContentfulTypeCheck<
  ComponentSlide,
  TypeComponentSlideFields,
  "id" | "slug"
> = true;

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

  if (!("fields" in entry)) {
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
