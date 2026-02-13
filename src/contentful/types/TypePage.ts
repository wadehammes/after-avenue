import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeSectionSkeleton } from "./TypeSection";

export interface TypePageFields {
  entryTitle?: EntryFieldTypes.Symbol;
  pageTitle: EntryFieldTypes.Symbol;
  pageDisplayTitle?: EntryFieldTypes.Symbol;
  pageSubtitle?: EntryFieldTypes.Symbol;
  pageSlug: EntryFieldTypes.Symbol;
  pageDescription?: EntryFieldTypes.Text;
  sections?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeSectionSkeleton>
  >;
  contactFooterTitle?: EntryFieldTypes.Symbol;
  contactFooterButtonText?: EntryFieldTypes.Symbol;
  socialImage?: EntryFieldTypes.AssetLink;
  enableIndexing?: EntryFieldTypes.Boolean;
  metaDescription: EntryFieldTypes.Text;
  metaKeywords?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypePageSkeleton, Modifiers, Locales>;

export function isTypePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypePage<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "page";
}

export type TypePageWithoutLinkResolutionResponse =
  TypePage<"WITHOUT_LINK_RESOLUTION">;
export type TypePageWithoutUnresolvableLinksResponse =
  TypePage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypePageWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypePage<"WITH_ALL_LOCALES", Locales>;
export type TypePageWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypePage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypePageWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypePage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
