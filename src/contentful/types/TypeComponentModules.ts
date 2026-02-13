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

export function isTypeComponentModules<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeComponentModules<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "componentModules";
}

export type TypeComponentModulesWithoutLinkResolutionResponse =
  TypeComponentModules<"WITHOUT_LINK_RESOLUTION">;
export type TypeComponentModulesWithoutUnresolvableLinksResponse =
  TypeComponentModules<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeComponentModulesWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentModules<"WITH_ALL_LOCALES", Locales>;
export type TypeComponentModulesWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentModules<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeComponentModulesWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentModules<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
