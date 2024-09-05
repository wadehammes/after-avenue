import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeComponentCopyBlockSkeleton } from "./TypeComponentCopyBlock";
import type { TypeComponentHeroSkeleton } from "./TypeComponentHero";
import type { TypeComponentLogoTickerSkeleton } from "./TypeComponentLogoTicker";
import type { TypeComponentSlideSkeleton } from "./TypeComponentSlide";

export interface TypeSectionFields {
  entryTitle?: EntryFieldTypes.Symbol;
  sectionHeader?: EntryFieldTypes.RichText;
  content: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeComponentCopyBlockSkeleton
      | TypeComponentHeroSkeleton
      | TypeComponentLogoTickerSkeleton
      | TypeComponentSlideSkeleton
    >
  >;
}

export type TypeSectionSkeleton = EntrySkeletonType<
  TypeSectionFields,
  "section"
>;
export type TypeSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeSectionSkeleton, Modifiers, Locales>;
