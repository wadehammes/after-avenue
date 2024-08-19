import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeWorkCategoryFields {
  entryTitle?: EntryFieldTypes.Symbol;
  categoryName: EntryFieldTypes.Symbol;
}

export type TypeWorkCategorySkeleton = EntrySkeletonType<
  TypeWorkCategoryFields,
  "workCategory"
>;
export type TypeWorkCategory<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeWorkCategorySkeleton, Modifiers, Locales>;
