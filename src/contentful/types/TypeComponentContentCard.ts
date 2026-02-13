import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeEditorsSkeleton } from "./TypeEditors";

export interface TypeComponentContentCardFields {
  entryTitle?: EntryFieldTypes.Symbol;
  image?: EntryFieldTypes.AssetLink;
  imageStyle?: EntryFieldTypes.Symbol<"Circle" | "Regular">;
  copy: EntryFieldTypes.RichText;
  copyAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
  style?: EntryFieldTypes.Symbol<"Card" | "No Style">;
  editorCta?: EntryFieldTypes.EntryLink<TypeEditorsSkeleton>;
  externalCta?: EntryFieldTypes.Symbol;
}

export type TypeComponentContentCardSkeleton = EntrySkeletonType<
  TypeComponentContentCardFields,
  "componentContentCard"
>;
export type TypeComponentContentCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeComponentContentCardSkeleton, Modifiers, Locales>;

export function isTypeComponentContentCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeComponentContentCard<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "componentContentCard";
}

export type TypeComponentContentCardWithoutLinkResolutionResponse =
  TypeComponentContentCard<"WITHOUT_LINK_RESOLUTION">;
export type TypeComponentContentCardWithoutUnresolvableLinksResponse =
  TypeComponentContentCard<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeComponentContentCardWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentContentCard<"WITH_ALL_LOCALES", Locales>;
export type TypeComponentContentCardWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentContentCard<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeComponentContentCardWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeComponentContentCard<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
