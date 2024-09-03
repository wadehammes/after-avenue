import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeComponentHeroFields {
  entryTitle?: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  subtitle?: EntryFieldTypes.Symbol;
  animatedTitle?: EntryFieldTypes.Boolean;
  titleSize?: EntryFieldTypes.Symbol<"Large" | "Regular">;
}

export type TypeComponentHeroSkeleton = EntrySkeletonType<
  TypeComponentHeroFields,
  "componentHero"
>;
export type TypeComponentHero<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentHeroSkeleton, Modifiers, Locales>;
