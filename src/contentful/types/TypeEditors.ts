import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeWorkSkeleton } from "./TypeWork";

export interface TypeEditorsFields {
  entryTitle?: EntryFieldTypes.Symbol;
  editorName: EntryFieldTypes.Symbol;
  editorSlug: EntryFieldTypes.Symbol;
  editorTitle?: EntryFieldTypes.Symbol;
  editorBio?: EntryFieldTypes.RichText;
  editorHeadshot?: EntryFieldTypes.AssetLink;
  editorHeadshotHover?: EntryFieldTypes.AssetLink;
  featuredWork?: EntryFieldTypes.EntryLink<TypeWorkSkeleton>;
  contactFooterTitle?: EntryFieldTypes.Symbol;
  contactFooterButtonText?: EntryFieldTypes.Symbol;
  priority?: EntryFieldTypes.Boolean;
  metaDescription: EntryFieldTypes.Text;
  showOnEditorsPage?: EntryFieldTypes.Boolean;
}

export type TypeEditorsSkeleton = EntrySkeletonType<
  TypeEditorsFields,
  "editors"
>;
export type TypeEditors<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeEditorsSkeleton, Modifiers, Locales>;

export function isTypeEditors<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeEditors<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "editors";
}

export type TypeEditorsWithoutLinkResolutionResponse =
  TypeEditors<"WITHOUT_LINK_RESOLUTION">;
export type TypeEditorsWithoutUnresolvableLinksResponse =
  TypeEditors<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeEditorsWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeEditors<"WITH_ALL_LOCALES", Locales>;
export type TypeEditorsWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeEditors<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeEditorsWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeEditors<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
