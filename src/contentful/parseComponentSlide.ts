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
import {
  isTypeComponentSlide,
  type TypeComponentSlideFields,
  type TypeComponentSlideWithoutUnresolvableLinksResponse,
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
  | TypeComponentSlideWithoutUnresolvableLinksResponse
  | undefined;

export function parseContentfulComponentSlide(
  entry?: ComponentSlideEntry,
): ComponentSlide | null {
  if (!entry || !isTypeComponentSlide(entry)) {
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
