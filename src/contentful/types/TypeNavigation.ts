import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypePageSkeleton } from "./TypePage";

export interface TypeNavigationFields {
  entryTitle?: EntryFieldTypes.Symbol;
  id: EntryFieldTypes.Symbol;
  navigationItems: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypePageSkeleton>
  >;
}

export type TypeNavigationSkeleton = EntrySkeletonType<
  TypeNavigationFields,
  "navigation"
>;
export type TypeNavigation<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;
