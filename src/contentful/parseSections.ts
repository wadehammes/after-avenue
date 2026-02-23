import type { Document } from "@contentful/rich-text-types";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type { ComponentCopyBlockEntry } from "src/contentful/parseComponentCopyBlock";
import type { ComponentModulesEntry } from "src/contentful/parseComponentModules";
import type { ComponentSlideEntry } from "src/contentful/parseComponentSlide";
import type { ContentCardEntry } from "src/contentful/parseContentCard";
import {
  isTypeSection,
  type TypeSectionFields,
  type TypeSectionWithoutUnresolvableLinksResponse,
} from "src/contentful/types";
import type { Alignment } from "src/interfaces/common.interfaces";

export type SectionPaddingType = ExtractSymbolType<
  NonNullable<TypeSectionFields["sectionPadding"]>
>;

export type SectionBackgroundColorType = ExtractSymbolType<
  NonNullable<TypeSectionFields["sectionBackgroundColor"]>
>;

export type ContentLayoutType = ExtractSymbolType<
  NonNullable<TypeSectionFields["contentLayout"]>
>;

export type Content =
  | ContentCardEntry
  | ComponentCopyBlockEntry
  | ComponentSlideEntry
  | ComponentModulesEntry
  | undefined;

export interface SectionType {
  content: Content[];
  contentLayout?: ContentLayoutType | undefined;
  id: string;
  sectionHeader?: Document | undefined;
  sectionHeaderAlignment?: Alignment;
  sectionBackgroundColor?: SectionBackgroundColorType;
  sectionPadding?: SectionPaddingType;
  slug: string;
}

const _sectionTypeValidation: ContentfulTypeCheck<
  SectionType,
  TypeSectionFields,
  "id"
> = true;

export type SectionEntry =
  | TypeSectionWithoutUnresolvableLinksResponse
  | undefined;

export function parseContentfulSection(
  sectionEntry?: SectionEntry,
): SectionType | null {
  if (!sectionEntry || !isTypeSection(sectionEntry)) {
    return null;
  }

  return {
    content: sectionEntry.fields.content.map((entry) => entry as Content),
    contentLayout:
      (sectionEntry.fields.contentLayout as ContentLayoutType) ||
      "Single Column",
    id: sectionEntry.sys.id,
    sectionHeader: sectionEntry.fields.sectionHeader,
    sectionHeaderAlignment: sectionEntry.fields
      .sectionHeaderAlignment as Alignment,
    sectionBackgroundColor:
      (sectionEntry.fields
        .sectionBackgroundColor as SectionBackgroundColorType) ||
      "System Color",
    sectionPadding:
      (sectionEntry.fields.sectionPadding as SectionPaddingType) || "Regular",
    slug: sectionEntry.fields.slug,
  };
}
