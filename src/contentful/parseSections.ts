import { Document } from "@contentful/rich-text-types";
import { Entry } from "contentful";
import {
  TypeComponentCopyBlockSkeleton,
  TypeSectionSkeleton,
} from "src/contentful/types";

export type Content =
  | Entry<TypeComponentCopyBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export interface Section {
  id: string;
  sectionHeader: Document | undefined;
  content: Content[];
}

export type SectionEntry =
  | Entry<TypeSectionSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulSection(section: SectionEntry): Section | null {
  if (!section) {
    return null;
  }

  if (!("fields" in section)) {
    return null;
  }

  return {
    id: section.sys.id,
    sectionHeader: section.fields.sectionHeader,
    content: section.fields.content,
  };
}
