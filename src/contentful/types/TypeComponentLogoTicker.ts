import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeComponentLogoTickerFields {
  entryTitle?: EntryFieldTypes.Symbol;
  logos: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
}

export type TypeComponentLogoTickerSkeleton = EntrySkeletonType<
  TypeComponentLogoTickerFields,
  "componentLogoTicker"
>;
export type TypeComponentLogoTicker<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentLogoTickerSkeleton, Modifiers, Locales>;
