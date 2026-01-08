import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeComponentContentCardFields {
  entryTitle?: EntryFieldTypes.Symbol;
  image?: EntryFieldTypes.AssetLink;
  imageStyle?: EntryFieldTypes.Symbol<"Circle" | "Regular">;
  copy: EntryFieldTypes.RichText;
  copyAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
  style?: EntryFieldTypes.Symbol<"Card" | "No Style">;
}

export type TypeComponentContentCardSkeleton = EntrySkeletonType<
  TypeComponentContentCardFields,
  "componentContentCard"
>;
export type TypeComponentContentCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentContentCardSkeleton, Modifiers, Locales>;
