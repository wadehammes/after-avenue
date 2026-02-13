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

export function isTypeComponentCopyBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeComponentCopyBlock<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "componentCopyBlock";
}

export type TypeComponentCopyBlockWithoutLinkResolutionResponse =
  TypeComponentCopyBlock<"WITHOUT_LINK_RESOLUTION">;
export type TypeComponentCopyBlockWithoutUnresolvableLinksResponse =
  TypeComponentCopyBlock<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeComponentCopyBlockWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentCopyBlock<"WITH_ALL_LOCALES", Locales>;
export type TypeComponentCopyBlockWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentCopyBlock<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeComponentCopyBlockWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentCopyBlock<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
