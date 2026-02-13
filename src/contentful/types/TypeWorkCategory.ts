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
  slug: EntryFieldTypes.Symbol;
}

export type TypeWorkCategorySkeleton = EntrySkeletonType<
  TypeWorkCategoryFields,
  "workCategory"
>;
export type TypeWorkCategory<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeWorkCategorySkeleton, Modifiers, Locales>;

export function isTypeWorkCategory<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeWorkCategory<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "workCategory";
}

export type TypeWorkCategoryWithoutLinkResolutionResponse =
  TypeWorkCategory<"WITHOUT_LINK_RESOLUTION">;
export type TypeWorkCategoryWithoutUnresolvableLinksResponse =
  TypeWorkCategory<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeWorkCategoryWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeWorkCategory<"WITH_ALL_LOCALES", Locales>;
export type TypeWorkCategoryWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeWorkCategory<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeWorkCategoryWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeWorkCategory<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
