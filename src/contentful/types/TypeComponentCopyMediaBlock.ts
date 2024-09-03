import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeComponentCopyMediaBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  copy?: EntryFieldTypes.RichText;
  media?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  copyPlacement?: EntryFieldTypes.Symbol<"Left" | "Right">;
}

export type TypeComponentCopyMediaBlockSkeleton = EntrySkeletonType<
  TypeComponentCopyMediaBlockFields,
  "componentCopyMediaBlock"
>;
export type TypeComponentCopyMediaBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentCopyMediaBlockSkeleton, Modifiers, Locales>;
