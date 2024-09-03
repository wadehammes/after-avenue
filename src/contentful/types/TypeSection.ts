import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeComponentCopyBlockSkeleton } from "./TypeComponentCopyBlock";
import type { TypeComponentCopyMediaBlockSkeleton } from "./TypeComponentCopyMediaBlock";
import type { TypeComponentHeroSkeleton } from "./TypeComponentHero";
import type { TypeComponentLogoTickerSkeleton } from "./TypeComponentLogoTicker";

export interface TypeSectionFields {
  entryTitle?: EntryFieldTypes.Symbol;
  sectionHeader?: EntryFieldTypes.RichText;
  content: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeComponentCopyBlockSkeleton
      | TypeComponentCopyMediaBlockSkeleton
      | TypeComponentHeroSkeleton
      | TypeComponentLogoTickerSkeleton
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
