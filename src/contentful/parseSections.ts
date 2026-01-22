import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type { ComponentCopyBlockEntry } from "src/contentful/parseComponentCopyBlock";
import type { ComponentModulesEntry } from "src/contentful/parseComponentModules";
import type { ComponentSlideEntry } from "src/contentful/parseComponentSlide";
import type { ContentCardEntry } from "src/contentful/parseContentCard";
import type { TypeSectionSkeleton } from "src/contentful/types";
import type { Alignment } from "src/interfaces/common.interfaces";

export enum SectionBackgroundColor {
  Black = "Black",
  SystemColor = "System Color",
  White = "White",
  Yellow = "Yellow",
}

export enum ContentLayout {
  FourColumn = "Four Column",
  TwoColumn = "Two Column",
  ThreeColumn = "Three Column",
  SingleColumn = "Single Column",
  FullWidth = "Full Width",
}

export type Content =
  | ContentCardEntry
  | ComponentCopyBlockEntry
  | ComponentSlideEntry
  | ComponentModulesEntry
  | undefined;

export interface SectionType {
  content: Content[];
  contentLayout: ContentLayout | undefined;
  id: string;
  sectionHeader: Document | undefined;
  sectionHeaderAlignment: Alignment;
  sectionBackgroundColor: SectionBackgroundColor;
  slug: string;
}

export type SectionEntry =
  | Entry<TypeSectionSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulSection(
  section: SectionEntry,
): SectionType | null {
  if (!section || !("fields" in section)) {
    return null;
  }

  return {
    content: section.fields.content.map((entry) => entry as Content),
    contentLayout:
      (section.fields.contentLayout as ContentLayout) ??
      ContentLayout.FullWidth,
    id: section.sys.id,
    sectionHeader: section.fields.sectionHeader,
    sectionHeaderAlignment: section.fields.sectionHeaderAlignment as Alignment,
    sectionBackgroundColor:
      (section.fields.sectionBackgroundColor as SectionBackgroundColor) ??
      SectionBackgroundColor.SystemColor,
    slug: section.fields.slug,
  };
}
