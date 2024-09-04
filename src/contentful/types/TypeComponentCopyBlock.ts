import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeComponentCopyBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  copy: EntryFieldTypes.RichText;
  textAlign?: EntryFieldTypes.Symbol<"center" | "left" | "right">;
}

export type TypeComponentCopyBlockSkeleton = EntrySkeletonType<
  TypeComponentCopyBlockFields,
  "componentCopyBlock"
>;
export type TypeComponentCopyBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentCopyBlockSkeleton, Modifiers, Locales>;
