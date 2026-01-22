import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeComponentModulesFields {
  entryTitle?: EntryFieldTypes.Symbol;
  module: EntryFieldTypes.Symbol<
    "Featured Brands Marquee" | "Services Marquee"
  >;
}

export type TypeComponentModulesSkeleton = EntrySkeletonType<
  TypeComponentModulesFields,
  "componentModules"
>;
export type TypeComponentModules<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentModulesSkeleton, Modifiers, Locales>;
