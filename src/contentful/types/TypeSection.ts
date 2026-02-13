import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeComponentContentCardSkeleton } from "./TypeComponentContentCard";
import type { TypeComponentCopyBlockSkeleton } from "./TypeComponentCopyBlock";
import type { TypeComponentModulesSkeleton } from "./TypeComponentModules";
import type { TypeComponentSlideSkeleton } from "./TypeComponentSlide";

export interface TypeSectionFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  sectionHeader?: EntryFieldTypes.RichText;
  sectionHeaderAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
  sectionBackgroundColor?: EntryFieldTypes.Symbol<
    "Black" | "System Color" | "White" | "Yellow"
  >;
  sectionPadding?: EntryFieldTypes.Symbol<"None" | "Regular">;
  content: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeComponentContentCardSkeleton
      | TypeComponentCopyBlockSkeleton
      | TypeComponentModulesSkeleton
      | TypeComponentSlideSkeleton
    >
  >;
  contentLayout?: EntryFieldTypes.Symbol<
    | "Four Column"
    | "Full Width"
    | "Single Column"
    | "Three Column"
    | "Two Column"
  >;
}

export type TypeSectionSkeleton = EntrySkeletonType<
  TypeSectionFields,
  "section"
>;
export type TypeSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeSectionSkeleton, Modifiers, Locales>;

export function isTypeSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeSection<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "section";
}

export type TypeSectionWithoutLinkResolutionResponse =
  TypeSection<"WITHOUT_LINK_RESOLUTION">;
export type TypeSectionWithoutUnresolvableLinksResponse =
  TypeSection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSectionWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeSection<"WITH_ALL_LOCALES", Locales>;
export type TypeSectionWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeSection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSectionWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeSection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
