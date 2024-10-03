import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type { ComponentCopyBlockEntry } from "src/contentful/parseComponentCopyBlock";
import type { ComponentSlideEntry } from "src/contentful/parseComponentSlide";
import type { TypeSectionSkeleton } from "src/contentful/types";

export type Content = ComponentCopyBlockEntry | ComponentSlideEntry | undefined;

export interface SectionType {
  content: Content[];
  id: string;
  sectionHeader: Document | undefined;
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
    id: section.sys.id,
    sectionHeader: section.fields.sectionHeader,
    slug: section.fields.slug,
  };
}
