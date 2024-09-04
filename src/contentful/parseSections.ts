import { Document } from "@contentful/rich-text-types";
import { Entry } from "contentful";
import { ComponentCopyBlockEntry } from "src/contentful/parseComponentCopyBlock";
import { ComponentHeroEntry } from "src/contentful/parseComponentHero";
import { ComponentLogoTickerEntry } from "src/contentful/parseComponentLogoTicker";
import { ComponentSlideEntry } from "src/contentful/parseComponentSlide";
import { TypeSectionSkeleton } from "src/contentful/types";

export type Content =
  | ComponentCopyBlockEntry
  | ComponentHeroEntry
  | ComponentLogoTickerEntry
  | ComponentSlideEntry
  | undefined;

export interface SectionType {
  id: string;
  sectionHeader: Document | undefined;
  content: Content[];
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
    id: section.sys.id,
    sectionHeader: section.fields.sectionHeader,
    content: section.fields.content.map((entry) => entry as Content),
  };
}
