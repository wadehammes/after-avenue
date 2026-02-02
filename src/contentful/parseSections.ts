import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type { ComponentCopyBlockEntry } from "src/contentful/parseComponentCopyBlock";
import type { ComponentModulesEntry } from "src/contentful/parseComponentModules";
import type { ComponentSlideEntry } from "src/contentful/parseComponentSlide";
import type { ContentCardEntry } from "src/contentful/parseContentCard";
import type {
  TypeSectionFields,
  TypeSectionSkeleton,
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
  contentLayout: ContentLayoutType | undefined;
  id: string;
  sectionHeader: Document | undefined;
  sectionHeaderAlignment: Alignment;
  sectionBackgroundColor: SectionBackgroundColorType;
  sectionPadding: SectionPaddingType;
  slug: string;
}

const _sectionTypeValidation: ContentfulTypeCheck<
  SectionType,
  TypeSectionFields,
  "id"
> = true;

export type SectionEntry =
  | Entry<TypeSectionSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulSection(
  section: SectionEntry,
): SectionType | null {
  if (!section) {
    return null;
  }

  if (!("fields" in section)) {
    return null;
  }

  return {
    content: section.fields.content.map((entry) => entry as Content),
    contentLayout:
      (section.fields.contentLayout as ContentLayoutType) || "Single Column",
    id: section.sys.id,
    sectionHeader: section.fields.sectionHeader,
    sectionHeaderAlignment: section.fields.sectionHeaderAlignment as Alignment,
    sectionBackgroundColor:
      (section.fields.sectionBackgroundColor as SectionBackgroundColorType) ||
      "System Color",
    sectionPadding:
      (section.fields.sectionPadding as SectionPaddingType) || "Regular",
    slug: section.fields.slug,
  };
}
