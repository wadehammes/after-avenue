import { Document } from "@contentful/rich-text-types";
import { Entry } from "contentful";
import { ComponentCopyBlockEntry } from "src/contentful/parseComponentCopyBlock";
import { ComponentSlideEntry } from "src/contentful/parseComponentSlide";
import { TypeSectionSkeleton } from "src/contentful/types";

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
