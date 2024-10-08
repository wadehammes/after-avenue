import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeComponentCopyBlockSkeleton } from "./TypeComponentCopyBlock";
import type { TypeComponentSlideSkeleton } from "./TypeComponentSlide";

export interface TypeSectionFields {
  entryTitle?: EntryFieldTypes.Symbol;
  sectionHeader?: EntryFieldTypes.RichText;
  content: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeComponentCopyBlockSkeleton | TypeComponentSlideSkeleton
    >
  >;
  slug: EntryFieldTypes.Symbol;
}

export type TypeSectionSkeleton = EntrySkeletonType<
  TypeSectionFields,
  "section"
>;
export type TypeSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeSectionSkeleton, Modifiers, Locales>;
